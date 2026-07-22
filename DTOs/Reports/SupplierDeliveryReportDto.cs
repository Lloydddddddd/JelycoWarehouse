namespace JelycoWarehouse.DTOs.Reports
{
    public class SupplierDeliveryReportDto
    {
        public int DeliveryId { get; set; }

        public string DeliveryReference { get; set; } = string.Empty;

        public string SupplierName { get; set; } = string.Empty;

        public DateTime DeliveryDate { get; set; }

        public int TotalQuantity { get; set; }

        public decimal GrandTotal { get; set; }
    }
}