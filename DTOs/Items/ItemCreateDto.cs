using System;

namespace JelycoWarehouse.DTOs.Items
{
    public class ItemCreateDto
    {
        public string Name { get; set; } = null!;
        public string Brand { get; set; } = null!;
        public string Kind { get; set; } = null!;
        public string Size { get; set; } = null!;
        public string Color { get; set; } = string.Empty;
        public string Category { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal CostPrice { get; set; }
        public int ReorderLevel { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int SupplierId { get; set; }
    }
}