namespace JelycoWarehouse.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int LocationId { get; set; }
        public int Quantity { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        // Navigation properties
        public Item? Item { get; set; }
        public Location? Location { get; set; }
    }
}