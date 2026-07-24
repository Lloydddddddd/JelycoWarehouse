using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.WarehouseReleases
{
    public class WarehouseReleaseCreateDto
    {
        public DateTime ReleaseDate { get; set; }

        [Required]
        [MaxLength(150)]
        public string Destination { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "At least one release item is required.")]
        public List<WarehouseReleaseCreateItemDto> Items { get; set; }
            = new();
    }
}