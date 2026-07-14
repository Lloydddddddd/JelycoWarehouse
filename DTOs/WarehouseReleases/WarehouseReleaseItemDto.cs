namespace JelycoWarehouse.DTOs.WarehouseReleases
{
    public class WarehouseReleaseItemDto
    {
        public int ItemId { get; set; }

        public string ItemName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public decimal UnitCost { get; set; }

        public decimal TotalCost { get; set; }
    }
}