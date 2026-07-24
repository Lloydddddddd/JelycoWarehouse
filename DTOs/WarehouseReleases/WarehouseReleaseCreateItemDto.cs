using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.WarehouseReleases
{
    public class WarehouseReleaseCreateItemDto
    {
        [Range(1, int.MaxValue)]
        public int ItemId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(typeof(decimal), "0", "999999999")]
        public decimal UnitCost { get; set; }
    }
}