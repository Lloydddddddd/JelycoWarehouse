using JelycoWarehouse.DTOs.SupplierDeliveries;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;

public class SupplierDeliveryService
{
    private readonly ISupplierDeliveryRepository _deliveryRepo;
    private readonly TransactionService _transactionService;
    private readonly ISupplierRepository _supplierRepo;
    private readonly IItemRepository _itemRepo;

    public SupplierDeliveryService(
        ISupplierDeliveryRepository deliveryRepo,
        ISupplierRepository supplierRepo,
        IItemRepository itemRepo,
        TransactionService transactionService)
    {
        _deliveryRepo = deliveryRepo;
        _supplierRepo = supplierRepo;
        _itemRepo = itemRepo;
        _transactionService = transactionService;
    }

    public async Task<IEnumerable<SupplierDeliveryDto>> GetAllAsync()
    {
        var deliveries = await _deliveryRepo.GetAllAsync();

        return deliveries.Select(d => new SupplierDeliveryDto
        {
            Id = d.Id,
            SupplierId = d.SupplierId,
            SupplierName = d.Supplier?.Name ?? string.Empty,
            DeliveryReference = d.DeliveryReference,
            DeliveryDate = d.DeliveryDate,
            GrandTotal = d.GrandTotal,

            Items = d.Items.Select(i => new SupplierDeliveryItemDto
            {
                ItemId = i.ItemId,
                ItemName = i.Item?.Name ?? string.Empty,
                Quantity = i.Quantity,
                UnitCost = i.UnitCost,
                TotalCost = i.TotalCost
            }).ToList()
        });
    }

    public async Task<SupplierDeliveryDto?> GetByIdAsync(int id)
    {
        var delivery = await _deliveryRepo.GetByIdAsync(id);

        if (delivery == null)
            return null;

        return new SupplierDeliveryDto
        {
            Id = delivery.Id,
            SupplierId = delivery.SupplierId,
            SupplierName = delivery.Supplier?.Name ?? string.Empty,
            DeliveryReference = delivery.DeliveryReference,
            DeliveryDate = delivery.DeliveryDate,
            GrandTotal = delivery.GrandTotal,

            Items = delivery.Items.Select(i => new SupplierDeliveryItemDto
            {
                ItemId = i.ItemId,
                ItemName = i.Item?.Name ?? string.Empty,
                Quantity = i.Quantity,
                UnitCost = i.UnitCost,
                TotalCost = i.TotalCost
            }).ToList()
        };
    }

    public async Task<SupplierDeliveryDto> AddAsync(
    SupplierDeliveryCreateDto dto)
    {
        dto.DeliveryReference = dto.DeliveryReference.Trim();

        if (string.IsNullOrWhiteSpace(dto.DeliveryReference))
            throw new InvalidOperationException(
                "Delivery reference is required.");

        if (await _deliveryRepo.ExistsByReferenceAsync(dto.DeliveryReference))
            throw new InvalidOperationException(
                "A delivery with this reference already exists.");

        var supplier = await _supplierRepo.GetByIdAsync(dto.SupplierId);

        if (supplier == null)
            throw new KeyNotFoundException(
                "Supplier not found.");

        if (dto.Items.Count == 0)
            throw new InvalidOperationException(
                "A delivery must contain at least one item.");

        var delivery = new SupplierDelivery
        {
            SupplierId = dto.SupplierId,
            DeliveryReference = dto.DeliveryReference,
            DeliveryDate = dto.DeliveryDate
        };

        foreach (var dtoItem in dto.Items)
        {
            var item = await _itemRepo.GetByIdAsync(dtoItem.ItemId);

            if (item == null)
                throw new KeyNotFoundException(
                    $"Item {dtoItem.ItemId} was not found.");

            if (dtoItem.Quantity <= 0)
                throw new InvalidOperationException(
                    "Quantity must be greater than zero.");

            if (dtoItem.UnitCost < 0)
                throw new InvalidOperationException(
                    "Unit cost cannot be negative.");

            delivery.Items.Add(new SupplierDeliveryItem
            {
                ItemId = dtoItem.ItemId,
                Quantity = dtoItem.Quantity,
                UnitCost = dtoItem.UnitCost,
                TotalCost = dtoItem.Quantity * dtoItem.UnitCost
            });
        }

        delivery.GrandTotal =
            delivery.Items.Sum(i => i.TotalCost);

        await _deliveryRepo.AddAsync(delivery);

        foreach (var item in delivery.Items)
        {
            await _transactionService.AddAsync(
                new Transaction
                {
                    ItemId = item.ItemId,
                    SupplierDeliveryId = delivery.Id,
                    Quantity = item.Quantity,
                    Type = TransactionType.IN,
                    Date = dto.DeliveryDate
                });
        }

        return new SupplierDeliveryDto
        {
            Id = delivery.Id,
            SupplierId = delivery.SupplierId,
            SupplierName = supplier.Name,
            DeliveryReference = delivery.DeliveryReference,
            DeliveryDate = delivery.DeliveryDate,
            GrandTotal = delivery.GrandTotal,

            Items = delivery.Items.Select(i => new SupplierDeliveryItemDto
            {
                ItemId = i.ItemId,
                ItemName = string.Empty,
                Quantity = i.Quantity,
                UnitCost = i.UnitCost,
                TotalCost = i.TotalCost
            }).ToList()
        };
    }

    // =========================
    // DELETE
    // =========================

    public async Task DeleteAsync(int id)
    {
        var delivery = await _deliveryRepo.GetByIdAsync(id);

        if (delivery == null)
            throw new Exception("Supplier delivery not found.");

        // Reverse stock by deleting the generated IN transactions
        await _transactionService.DeleteBySupplierDeliveryAsync(id);

        // Delete the supplier delivery and its items
        await _deliveryRepo.DeleteAsync(delivery);
    }
}