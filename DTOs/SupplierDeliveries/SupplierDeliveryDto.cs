using JelycoWarehouse.DTOs.SupplierDeliveries;

public class SupplierDeliveryDto
{
    public int Id { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string DeliveryReference { get; set; } = string.Empty;
    public DateTime DeliveryDate { get; set; }
    public List<SupplierDeliveryItemDto> Items { get; set; } = new();
}