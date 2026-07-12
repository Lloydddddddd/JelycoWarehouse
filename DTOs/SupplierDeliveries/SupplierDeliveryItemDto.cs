namespace JelycoWarehouse.DTOs.SupplierDeliveries
{
    public class SupplierDeliveryItemDto
    {
        public int ItemId { get; set; }

        // Returned to the frontend for display
        public string ItemName { get; set; } = string.Empty;

        public int Quantity { get; set; }

        // Cost of one unit
        public decimal UnitCost { get; set; }

        // Quantity × UnitCost
        public decimal TotalCost { get; set; }
    }
}