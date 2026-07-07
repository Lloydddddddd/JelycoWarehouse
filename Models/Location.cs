using JelycoWarehouse.Interfaces;

namespace JelycoWarehouse.Models
{
    public class Location
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}