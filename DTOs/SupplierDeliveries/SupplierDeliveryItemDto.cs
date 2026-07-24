using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.DTOs.SupplierDeliveries
{
    public class SupplierDeliveryItemDto
    {
        [Range(1, int.MaxValue)]
        public int ItemId { get; set; }

        // Returned to the frontend
        public string ItemName { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(typeof(decimal), "0", "999999999")]
        public decimal UnitCost { get; set; }

        public decimal TotalCost { get; set; }
    }
}