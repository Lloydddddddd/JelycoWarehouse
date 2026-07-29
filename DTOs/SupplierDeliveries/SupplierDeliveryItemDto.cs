using System.ComponentModel.DataAnnotations;

public class SupplierDeliveryItemDto
{
    [Range(1, int.MaxValue)]
    public int ItemId { get; set; }

    public string ItemName { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal UnitCost { get; set; }

    public decimal TotalCost { get; set; }

    // NEW
    public DateTime? ExpiryDate { get; set; }
}