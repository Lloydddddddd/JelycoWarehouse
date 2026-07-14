namespace JelycoWarehouse.DTOs.InventoryAdjustments
{
    public class InventoryAdjustmentCreateDto
    {
        public string AdjustmentReference { get; set; }
            = string.Empty;

        public DateTime AdjustmentDate { get; set; }

        public string Reason { get; set; }
            = string.Empty;

        public List<InventoryAdjustmentCreateItemDto> Items
            = new();
    }
}