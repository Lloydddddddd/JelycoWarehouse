namespace JelycoWarehouse.Models
{
    public class WarehouseReleaseItem
    {
        public int Id { get; set; }

        public int WarehouseReleaseId { get; set; }

        public int ItemId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitCost { get; set; }

        public decimal TotalCost { get; set; }

        public WarehouseRelease? WarehouseRelease { get; set; }

        public Item? Item { get; set; }
    }
}