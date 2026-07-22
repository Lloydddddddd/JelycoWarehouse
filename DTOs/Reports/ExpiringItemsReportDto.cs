namespace JelycoWarehouse.DTOs.Reports
{
    public class ExpiringItemsReportDto
    {
        public int ItemId { get; set; }

        public string ItemName { get; set; } = string.Empty;

        public string Brand { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public DateTime ExpiryDate { get; set; }

        public int DaysRemaining { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}