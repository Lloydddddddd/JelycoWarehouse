using System.ComponentModel.DataAnnotations;
using JelycoWarehouse.DTOs.SupplierDeliveries;

namespace JelycoWarehouse.DTOs.SupplierDeliveries
{
    public class SupplierDeliveryCreateDto
    {
        [Range(1, int.MaxValue)]
        public int SupplierId { get; set; }

        [Required]
        [MaxLength(100)]
        public string DeliveryReference { get; set; } = string.Empty;

        public DateTime DeliveryDate { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "At least one delivery item is required.")]
        public List<SupplierDeliveryItemDto> Items { get; set; } = new();
    }
}