namespace JelycoWarehouse.DTOs.InventoryAdjustments
{
    public class InventoryAdjustmentDto
    {
        public int Id { get; set; }

        public string AdjustmentReference { get; set; } = string.Empty;

        public DateTime AdjustmentDate { get; set; }

        public string Reason { get; set; } = string.Empty;

        public List<InventoryAdjustmentItemDto> Items { get; set; }
            = new();
    }
}