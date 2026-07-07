using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Models
{
    public class WarehouseContext : IdentityDbContext<ApplicationUser>
    {
        public WarehouseContext(DbContextOptions<WarehouseContext> options)
            : base(options) { }

        public DbSet<Item> Items { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<StockLevel> StockLevels { get; set; }
        public DbSet<SupplierDelivery> SupplierDeliveries { get; set; }
        public DbSet<SupplierDeliveryItem> SupplierDeliveryItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Fix decimal precision warning for UnitPrice
            builder.Entity<Item>()
                .Property(i => i.UnitPrice)
                .HasColumnType("decimal(18,2)");

            // Prevent multiple cascade paths
            builder.Entity<SupplierDelivery>()
                .HasOne(sd => sd.Supplier)
                .WithMany(s => s.Deliveries)
                .HasForeignKey(sd => sd.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SupplierDeliveryItem>()
                .HasOne(sdi => sdi.SupplierDelivery)
                .WithMany(sd => sd.Items)
                .HasForeignKey(sdi => sdi.SupplierDeliveryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SupplierDeliveryItem>()
                .HasOne(sdi => sdi.Item)
                .WithMany()
                .HasForeignKey(sdi => sdi.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Suppliers
            builder.Entity<Supplier>().HasData(
                new Supplier { Id = 1, Name = "ABC Supplies", ContactInfo = "123-456", Address = "Main St", Email = "abc@supplies.com", IsActive = true },
                new Supplier { Id = 2, Name = "XYZ Traders", ContactInfo = "789-012", Address = "Market Rd", Email = "xyz@traders.com", IsActive = true },
                new Supplier { Id = 3, Name = "Inactive Supplier", ContactInfo = "000-000", Address = "Old Rd", Email = "inactive@supplier.com", IsActive = false }
            );

            // Seed Items
            builder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "Hammer", Brand = "ToolCo", Kind = "Hand Tool", Size = "Medium", Category = "Tools", Quantity = 50, UnitPrice = 150.00m, ReorderLevel = 10, SupplierId = 1, IsActive = true },
                new Item { Id = 2, Name = "Screwdriver", Brand = "FixIt", Kind = "Hand Tool", Size = "Small", Category = "Tools", Quantity = 100, UnitPrice = 75.00m, ReorderLevel = 20, SupplierId = 1, IsActive = true },
                new Item { Id = 3, Name = "Expired Paint", Brand = "ColorMax", Kind = "Paint", Size = "1L", Category = "Paints", Quantity = 0, UnitPrice = 200.00m, ReorderLevel = 5, SupplierId = 2, IsActive = false }
            );
        }
    }
}