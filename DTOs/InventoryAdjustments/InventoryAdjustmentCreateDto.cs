using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.InventoryAdjustments
{
    public class InventoryAdjustmentCreateDto
    {
        public string AdjustmentReference { get; set; }
            = string.Empty;

        public DateTime AdjustmentDate { get; set; }

        [Required]
        [MaxLength(250)]
        public string Reason { get; set; }
            = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "At least one adjustment item is required.")]
        public List<InventoryAdjustmentCreateItemDto> Items
        { get; set; } = new();
    }
}