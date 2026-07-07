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

        [MaxLength(50)]
        public string Brand { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Kind { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Size { get; set; } = string.Empty;

        public string Category { get; set; } = null!;
        public int Quantity { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal UnitPrice { get; set; }
        public int ReorderLevel { get; set; }

        // Foreign key
        public int SupplierId { get; set; }

        // Navigation property
        public Supplier Supplier { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }
}