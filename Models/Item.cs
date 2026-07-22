using System;
using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.Models
{
    public class Item
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        public int BrandId { get; set; }

        public Brand? Brand { get; set; }

        [MaxLength(50)]
        public string Kind { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Size { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Color { get; set; } = string.Empty;

        public string Category { get; set; } = null!;

        // Current stock quantity
        public int Quantity { get; set; }

        // Minimum stock before the item is considered low stock
        public int ReorderLevel { get; set; } = 10;

        public DateTime? ExpiryDate { get; set; }

        public decimal CostPrice { get; set; }

        public bool IsActive { get; set; } = true;
    }
}