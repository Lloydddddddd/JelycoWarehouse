namespace JelycoWarehouse.DTOs.Transactions
{
    public class TransactionUpdateDto
    {
        public int ItemId { get; set; }
        public int LocationId { get; set; }
        public int Quantity { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}