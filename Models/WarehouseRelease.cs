using System.ComponentModel.DataAnnotations;

namespace JelycoWarehouse.Models
{
    public class WarehouseRelease
    {
        public int Id { get; set; }

        public string ReleaseReference { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        // Where the items are going
        [MaxLength(150)]
        public string Destination { get; set; } = string.Empty;

        public decimal GrandTotal { get; set; }

        public ICollection<WarehouseReleaseItem> Items { get; set; }
            = new List<WarehouseReleaseItem>();

        public ICollection<Transaction> Transactions { get; set; }
            = new List<Transaction>();
    }
}