using JelycoWarehouse.Enums;
using JelycoWarehouse.Models;

public class Transaction
{
    public int Id { get; set; }

    public int ItemId { get; set; }
    public int LocationId { get; set; }

    public int Quantity { get; set; }

    public TransactionType Type { get; set; }

    public DateTime Date { get; set; } = DateTime.UtcNow;

    // Navigation
    public Item? Item { get; set; }
    public Location? Location { get; set; }
}