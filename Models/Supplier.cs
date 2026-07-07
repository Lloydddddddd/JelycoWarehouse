using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.Models
{
    public class Supplier
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        public string ContactInfo { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Email { get; set; } = null!;

        public ICollection<Item> Items { get; set; } = new List<Item>();
        public ICollection<SupplierDelivery> Deliveries { get; set; } = new List<SupplierDelivery>();

        public bool IsActive { get; set; } = true;
    }
}