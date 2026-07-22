using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.Items
{
    public class ItemUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int BrandId { get; set; }

        [MaxLength(50)]
        public string Kind { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Size { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Color { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int ReorderLevel { get; set; }

        [Range(typeof(decimal), "0", "999999999")]
        public decimal CostPrice { get; set; }

        public DateTime? ExpiryDate { get; set; }
    }
}