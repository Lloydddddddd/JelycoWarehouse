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
            var totalCost = item.Quantity * item.UnitCost;

            delivery.Items.Add(new SupplierDeliveryItem
            {
                ItemId = item.ItemId,
                Quantity = item.Quantity,
                UnitCost = item.UnitCost,
                TotalCost = totalCost
            });
        }

        delivery.GrandTotal =
            delivery.Items.Sum(i => i.TotalCost);

        await _deliveryRepo.AddAsync(delivery);

        // Automatically create stock IN transactions
        foreach (var item in delivery.Items)
        {
            var transaction = new Transaction
            {
                ItemId = item.ItemId,
                LocationId = 1,
                Quantity = item.Quantity,
                Type = TransactionType.IN,
                Date = dto.DeliveryDate
            };

            await _transactionService.AddAsync(transaction);
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
}