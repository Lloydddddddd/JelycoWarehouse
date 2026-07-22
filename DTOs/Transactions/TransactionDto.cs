namespace JelycoWarehouse.DTOs.Transactions
{
    public class TransactionDto
    {
        public int Id { get; set; }

        public int ItemId { get; set; }

        public string ItemName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public string Type { get; set; } = string.Empty;

        public DateTime Date { get; set; }
    }
}