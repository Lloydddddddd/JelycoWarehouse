namespace JelycoWarehouse.DTOs.WarehouseReleases
{
    public class WarehouseReleaseDto
    {
        public int Id { get; set; }

        public string ReleaseReference { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        public string Destination { get; set; } = string.Empty;

        public decimal GrandTotal { get; set; }

        public List<WarehouseReleaseItemDto> Items { get; set; }
            = new();
    }
}