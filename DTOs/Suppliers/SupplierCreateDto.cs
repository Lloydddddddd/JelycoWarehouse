namespace JelycoWarehouse.DTOs.Suppliers
{
    public class SupplierCreateDto
    {
        public string Name { get; set; } = null!;
        public string ContactInfo { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}