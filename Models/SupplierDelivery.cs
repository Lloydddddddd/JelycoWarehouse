using JelycoWarehouse.Models;

public class SupplierDelivery
{
    public int Id { get; set; }

    public int SupplierId { get; set; }

    // Invoice number / Delivery receipt number
    public string DeliveryReference { get; set; } = string.Empty;

    public DateTime DeliveryDate { get; set; }

    // Total amount of the entire delivery
    public decimal GrandTotal { get; set; }

    public ICollection<SupplierDeliveryItem> Items { get; set; } = new List<SupplierDeliveryItem>();

    public Supplier? Supplier { get; set; }
}