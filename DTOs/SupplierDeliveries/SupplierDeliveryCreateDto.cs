using JelycoWarehouse.DTOs.SupplierDeliveries;

public class SupplierDeliveryCreateDto
{
    public int SupplierId { get; set; }

    public string DeliveryReference { get; set; } = string.Empty;

    public DateTime DeliveryDate { get; set; }

    public List<SupplierDeliveryItemDto> Items { get; set; } = new();
}