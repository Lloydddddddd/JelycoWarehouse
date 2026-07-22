using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.Brands
{
    public class BrandCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }
}