using JelycoWarehouse.DTOs.SupplierDeliveries;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;

public class SupplierDeliveryService
{
    private readonly ISupplierDeliveryRepository _deliveryRepo;
    private readonly TransactionService _transactionService;

    public SupplierDeliveryService(
        ISupplierDeliveryRepository deliveryRepo,
        TransactionService transactionService)
    {
        _deliveryRepo = deliveryRepo;
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
        var delivery = new SupplierDelivery
        {
            SupplierId = dto.SupplierId,
            DeliveryReference = dto.DeliveryReference,
            DeliveryDate = dto.DeliveryDate
        };

        foreach (var item in dto.Items)
        {
            delivery.Items.Add(new SupplierDeliveryItem
            {
                ItemId = item.ItemId,
                Quantity = item.Quantity,
                UnitCost = item.UnitCost,
                TotalCost = item.Quantity * item.UnitCost
            });
        }

        delivery.GrandTotal =
            delivery.Items.Sum(i => i.TotalCost);

        await _deliveryRepo.AddAsync(delivery);

        // Automatically create stock IN transactions
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