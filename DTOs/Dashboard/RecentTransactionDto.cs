namespace JelycoWarehouse.DTOs.Dashboard;

public class RecentTransactionDto
{
    public DateTime Date { get; set; }

    public string ItemName { get; set; } = string.Empty;

    public string TransactionType { get; set; } = string.Empty;

    public int Quantity { get; set; }
}