namespace JelycoWarehouse.DTOs.WarehouseReleases
{
    public class WarehouseReleaseCreateItemDto
    {
        public int ItemId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitCost { get; set; }
    }
}