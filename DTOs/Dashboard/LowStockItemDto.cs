namespace JelycoWarehouse.DTOs.Dashboard;

public class LowStockItemDto
{
    public string ItemName { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public int ReorderLevel { get; set; }
}