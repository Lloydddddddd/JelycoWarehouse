namespace JelycoWarehouse.DTOs.InventoryAdjustments
{
    public class InventoryAdjustmentItemDto
    {
        public int ItemId { get; set; }

        public string ItemName { get; set; } = string.Empty;

        public int SystemQuantity { get; set; }

        public int ActualQuantity { get; set; }

        public int Difference { get; set; }
    }
}