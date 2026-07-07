namespace JelycoWarehouse.Models
{
    public class StockLevel
    {
        public int Id { get; set; }

        // Foreign keys
        public int ItemId { get; set; }
        public int LocationId { get; set; }

        // Navigation properties
        public Item Item { get; set; } = null!;
        public Location Location { get; set; } = null!;

        public int Quantity { get; set; }
    }
}