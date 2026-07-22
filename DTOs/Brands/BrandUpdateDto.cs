using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.Brands
{
    public class BrandUpdateDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}