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

    // Delivery Items
    public ICollection<SupplierDeliveryItem> Items { get; set; }
        = new List<SupplierDeliveryItem>();

    // NEW
    // Transactions automatically created by this delivery
    public ICollection<Transaction> Transactions { get; set; }
        = new List<Transaction>();

    public Supplier? Supplier { get; set; }
}