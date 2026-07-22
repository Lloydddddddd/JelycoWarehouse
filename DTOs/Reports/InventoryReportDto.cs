namespace JelycoWarehouse.DTOs.Reports
{
    public class InventoryReportDto
    {
        public int ItemId { get; set; }

        public string ItemName { get; set; } = string.Empty;

        public string Brand { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Kind { get; set; } = string.Empty;

        public string Size { get; set; } = string.Empty;

        public string Color { get; set; } = string.Empty;

        public int CurrentStock { get; set; }

        public int ReorderLevel { get; set; }

        public decimal UnitCost { get; set; }

        public decimal StockValue { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime? ExpiryDate { get; set; }
    }
}