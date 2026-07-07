using JelycoWarehouse.Models;

public class SupplierDelivery
{
    public int Id { get; set; }
    public int SupplierId { get; set; }
    public string DeliveryReference { get; set; } = string.Empty; // e.g., invoice #
    public DateTime DeliveryDate { get; set; }

    public ICollection<SupplierDeliveryItem> Items { get; set; } = new List<SupplierDeliveryItem>();
    public Supplier? Supplier { get; set; }
}