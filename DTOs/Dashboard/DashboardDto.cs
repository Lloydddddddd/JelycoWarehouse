namespace JelycoWarehouse.DTOs.Dashboard;

public class DashboardDto
{
    public int TotalItems { get; set; }

    public int TotalStock { get; set; }

    public decimal InventoryValue { get; set; }

    public int LowStockItems { get; set; }

    public int TotalIn { get; set; }

    public int TotalOut { get; set; }

    public List<RecentTransactionDto> RecentTransactions { get; set; } = [];

    public List<LowStockItemDto> LowStockList { get; set; } = [];
}