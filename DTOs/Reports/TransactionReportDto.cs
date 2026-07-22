namespace JelycoWarehouse.DTOs.Reports
{
    public class TransactionReportDto
    {
        public int TransactionId { get; set; }

        public DateTime Date { get; set; }

        public string ItemName { get; set; } = string.Empty;

        public string Brand { get; set; } = string.Empty;

        public string TransactionType { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public string Reference { get; set; } = string.Empty;
    }
}