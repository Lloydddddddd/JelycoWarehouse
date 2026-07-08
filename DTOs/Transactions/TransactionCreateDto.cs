using JelycoWarehouse.Enums;

namespace JelycoWarehouse.DTOs.Transactions
{
    public class TransactionCreateDto
    {
        public int ItemId { get; set; }
        public int LocationId { get; set; }
        public int Quantity { get; set; }
        public TransactionType Type { get; set; }
    }
}