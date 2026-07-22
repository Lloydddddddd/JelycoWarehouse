namespace JelycoWarehouse.Models
{
    public class Brand
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Item> Items { get; set; } = new List<Item>();
    }
}