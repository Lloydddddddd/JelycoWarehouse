namespace JelycoWarehouse.DTOs.Transactions
{
    public class TransactionCreateDto
    {
        public int ItemId { get; set; }
        public int LocationId { get; set; }
        public int Quantity { get; set; }
        public string? Type { get; set; } // "IN" or "OUT"
        public DateTime Date { get; set; }
    }
}