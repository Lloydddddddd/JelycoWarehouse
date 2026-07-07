using JelycoWarehouse.DTOs.Items;

namespace JelycoWarehouse.DTOs.Suppliers
{
    public class SupplierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string ContactInfo { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;

        public bool IsActive { get; set; }

        public List<ItemDto> Items { get; set; } = null!;
    }
}