namespace JelycoWarehouse.DTOs.Reports
{
    public class WarehouseReleaseReportDto
    {
        public int ReleaseId { get; set; }

        public string ReleaseReference { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        public string Destination { get; set; } = string.Empty;

        public int TotalQuantity { get; set; }

        public decimal GrandTotal { get; set; }
    }
}