using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.InventoryAdjustments
{
    public class InventoryAdjustmentCreateItemDto
    {
        [Range(1, int.MaxValue)]
        public int ItemId { get; set; }

        [Range(0, int.MaxValue)]
        public int ActualQuantity { get; set; }
    }
}