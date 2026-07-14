namespace JelycoWarehouse.Models
{
    public class InventoryAdjustmentItem
    {
        public int Id { get; set; }

        public int InventoryAdjustmentId { get; set; }

        public int ItemId { get; set; }

        // Quantity currently recorded by the system
        public int SystemQuantity { get; set; }

        // Quantity physically counted
        public int ActualQuantity { get; set; }

        // Actual - System
        public int Difference { get; set; }

        public InventoryAdjustment? InventoryAdjustment
        { get; set; }

        public Item? Item { get; set; }
    }
}