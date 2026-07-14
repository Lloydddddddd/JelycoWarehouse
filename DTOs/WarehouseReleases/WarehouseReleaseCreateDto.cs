namespace JelycoWarehouse.DTOs.WarehouseReleases
{
    public class WarehouseReleaseCreateDto
    {
        public DateTime ReleaseDate { get; set; }

        public string Destination { get; set; } = string.Empty;

        public List<WarehouseReleaseCreateItemDto> Items { get; set; }
            = new();
    }
}