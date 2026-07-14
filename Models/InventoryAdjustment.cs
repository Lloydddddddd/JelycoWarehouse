using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.Models
{
    public class InventoryAdjustment
    {
        public int Id { get; set; }

        public string AdjustmentReference { get; set; }
            = string.Empty;

        public DateTime AdjustmentDate { get; set; }

        [MaxLength(250)]
        public string Reason { get; set; }
            = string.Empty;

        public ICollection<InventoryAdjustmentItem> Items
        { get; set; } = new List<InventoryAdjustmentItem>();

        public ICollection<Transaction> Transactions
        { get; set; } = new List<Transaction>();
    }
}