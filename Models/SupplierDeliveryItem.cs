using JelycoWarehouse.Models;

public class SupplierDeliveryItem
{
    public int Id { get; set; }

    public int SupplierDeliveryId { get; set; }

    public int ItemId { get; set; }

    public int Quantity { get; set; }

    public decimal UnitCost { get; set; }

    public decimal TotalCost { get; set; }

    // NEW
    public DateTime? ExpiryDate { get; set; }

    public SupplierDelivery? SupplierDelivery { get; set; }

    public Item? Item { get; set; }
}