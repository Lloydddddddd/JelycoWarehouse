using JelycoWarehouse.DTOs.SupplierDeliveries;
using JelycoWarehouse.Models;
using JelycoWarehouse.Interfaces;

public class SupplierDeliveryService
{
    private readonly ISupplierDeliveryRepository _deliveryRepo;
    private readonly ITransactionRepository _transactionRepo;

    public SupplierDeliveryService(ISupplierDeliveryRepository deliveryRepo, ITransactionRepository transactionRepo)
    {
        _deliveryRepo = deliveryRepo;
        _transactionRepo = transactionRepo;
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
            Items = d.Items.Select(i => new SupplierDeliveryItemDto
            {
                ItemId = i.ItemId,
                Quantity = i.Quantity
            }).ToList()
        });
    }

    public async Task<SupplierDeliveryDto?> GetByIdAsync(int id)
    {
        var delivery = await _deliveryRepo.GetByIdAsync(id);
        if (delivery == null) return null;

        return new SupplierDeliveryDto
        {
            Id = delivery.Id,
            SupplierId = delivery.SupplierId,
            SupplierName = delivery.Supplier?.Name ?? string.Empty,
            DeliveryReference = delivery.DeliveryReference,
            DeliveryDate = delivery.DeliveryDate,
            Items = delivery.Items.Select(i => new SupplierDeliveryItemDto
            {
                ItemId = i.ItemId,
                Quantity = i.Quantity
            }).ToList()
        };
    }

    public async Task<SupplierDeliveryDto> AddAsync(SupplierDeliveryCreateDto dto)
    {
        var delivery = new SupplierDelivery
        {
            SupplierId = dto.SupplierId,
            DeliveryReference = dto.DeliveryReference,
            DeliveryDate = dto.DeliveryDate,
            Items = dto.Items.Select(i => new SupplierDeliveryItem
            {
                ItemId = i.ItemId,
                Quantity = i.Quantity
            }).ToList()
        };

        await _deliveryRepo.AddAsync(delivery);

        // For each delivered item, create a linked IN transaction
        foreach (var item in delivery.Items)
        {
            var transaction = new Transaction
            {
                ItemId = item.ItemId,
                LocationId = 1, // default warehouse location
                Quantity = item.Quantity,
                Type = "IN",
                Date = dto.DeliveryDate
            };
            await _transactionRepo.AddAsync(transaction);
        }

        return new SupplierDeliveryDto
        {
            Id = delivery.Id,
            SupplierId = delivery.SupplierId,
            SupplierName = delivery.Supplier?.Name ?? string.Empty,
            DeliveryReference = delivery.DeliveryReference,
            DeliveryDate = delivery.DeliveryDate,
            Items = dto.Items
        };
    }
}