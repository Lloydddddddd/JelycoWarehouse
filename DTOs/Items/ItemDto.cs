namespace JelycoWarehouse.DTOs.Items
{
    public class ItemDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public int BrandId { get; set; }

        public string Brand { get; set; } = string.Empty;

        public string Kind { get; set; } = string.Empty;

        public string Size { get; set; } = string.Empty;

        public string Color { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public int Quantity { get; set; }

        // NEW
        public int ReorderLevel { get; set; }

        public decimal CostPrice { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public bool IsActive { get; set; }
    }
}