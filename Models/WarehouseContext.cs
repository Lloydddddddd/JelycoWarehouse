using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Models
{
    public class WarehouseContext : IdentityDbContext<ApplicationUser>
    {
        public WarehouseContext(DbContextOptions<WarehouseContext> options)
            : base(options) { }

        public DbSet<Item> Items { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<SupplierDelivery> SupplierDeliveries { get; set; }
        public DbSet<SupplierDeliveryItem> SupplierDeliveryItems { get; set; }
        public DbSet<WarehouseRelease> WarehouseReleases { get; set; }
        public DbSet<WarehouseReleaseItem> WarehouseReleaseItems { get; set; }
        public DbSet<InventoryAdjustment> InventoryAdjustments { get; set; }
        public DbSet<InventoryAdjustmentItem> InventoryAdjustmentItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // =========================
            // Decimal precision
            // =========================

            builder.Entity<Item>()
                .Property(i => i.CostPrice)
                .HasColumnType("decimal(18,2)");

            builder.Entity<SupplierDelivery>()
                .Property(d => d.GrandTotal)
                .HasColumnType("decimal(18,2)");

            builder.Entity<SupplierDeliveryItem>()
                .Property(i => i.UnitCost)
                .HasColumnType("decimal(18,2)");

            builder.Entity<SupplierDeliveryItem>()
                .Property(i => i.TotalCost)
                .HasColumnType("decimal(18,2)");

            builder.Entity<WarehouseRelease>()
                .Property(r => r.GrandTotal)
                .HasColumnType("decimal(18,2)");

            builder.Entity<WarehouseReleaseItem>()
                .Property(i => i.UnitCost)
                .HasColumnType("decimal(18,2)");

            builder.Entity<WarehouseReleaseItem>()
                .Property(i => i.TotalCost)
                .HasColumnType("decimal(18,2)");

            // =========================
            // Relationships
            // =========================

            builder.Entity<SupplierDelivery>()
                .HasOne(sd => sd.Supplier)
                .WithMany(s => s.Deliveries)
                .HasForeignKey(sd => sd.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<WarehouseReleaseItem>()
                .HasOne(wri => wri.WarehouseRelease)
                .WithMany(wr => wr.Items)
                .HasForeignKey(wri => wri.WarehouseReleaseId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<WarehouseReleaseItem>()
                .HasOne(wri => wri.Item)
                .WithMany()
                .HasForeignKey(wri => wri.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<InventoryAdjustmentItem>()
                .HasOne(i => i.InventoryAdjustment)
                .WithMany(a => a.Items)
                .HasForeignKey(i => i.InventoryAdjustmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<InventoryAdjustmentItem>()
                .HasOne(i => i.Item)
                .WithMany()
                .HasForeignKey(i => i.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Transaction>()
                .HasOne(t => t.InventoryAdjustment)
                .WithMany(a => a.Transactions)
                .HasForeignKey(t => t.InventoryAdjustmentId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Item>()
                .HasOne(i => i.Brand)
                .WithMany(b => b.Items)
                .HasForeignKey(i => i.BrandId)
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

            builder.Entity<Transaction>()
                .HasOne(t => t.SupplierDelivery)
                .WithMany(sd => sd.Transactions)
                .HasForeignKey(t => t.SupplierDeliveryId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Transaction>()
                .HasOne(t => t.WarehouseRelease)
                .WithMany(wr => wr.Transactions)
                .HasForeignKey(t => t.WarehouseReleaseId)
                .OnDelete(DeleteBehavior.SetNull);

            // =========================
            // Seed Brands
            // =========================

            builder.Entity<Brand>().HasData(
                new Brand
                {
                    Id = 1,
                    Name = "Stanley",
                    IsActive = true
                },
                new Brand
                {
                    Id = 2,
                    Name = "Bosch",
                    IsActive = true
                },
                new Brand
                {
                    Id = 3,
                    Name = "Makita",
                    IsActive = true
                },
                new Brand
                {
                    Id = 4,
                    Name = "ToolCo",
                    IsActive = true
                }
            );

            // =========================
            // Seed Suppliers
            // =========================

            builder.Entity<Supplier>().HasData(
                new Supplier
                {
                    Id = 1,
                    Name = "ABC Supplies",
                    ContactInfo = "123-456",
                    Address = "Main St",
                    Email = "abc@supplies.com",
                    IsActive = true
                },
                new Supplier
                {
                    Id = 2,
                    Name = "XYZ Traders",
                    ContactInfo = "789-012",
                    Address = "Market Rd",
                    Email = "xyz@traders.com",
                    IsActive = true
                },
                new Supplier
                {
                    Id = 3,
                    Name = "Inactive Supplier",
                    ContactInfo = "000-000",
                    Address = "Old Rd",
                    Email = "inactive@supplier.com",
                    IsActive = false
                }
            );

            // =========================
            // Seed Items
            // =========================

            builder.Entity<Item>().HasData(
                new Item
                {
                    Id = 1,
                    Name = "Hammer",
                    BrandId = 4,
                    Kind = "Hand Tool",
                    Size = "Medium",
                    Color = "",
                    Category = "Tools",
                    Quantity = 50,
                    CostPrice = 150.00m,
                    ExpiryDate = null,
                    IsActive = true
                },
                new Item
                {
                    Id = 2,
                    Name = "Screwdriver",
                    BrandId = 4,
                    Kind = "Hand Tool",
                    Size = "Small",
                    Color = "",
                    Category = "Tools",
                    Quantity = 100,
                    CostPrice = 75.00m,
                    ExpiryDate = null,
                    IsActive = true
                },
                new Item
                {
                    Id = 3,
                    Name = "Expired Paint",
                    BrandId = 4,
                    Kind = "Paint",
                    Size = "1L",
                    Color = "",
                    Category = "Paints",
                    Quantity = 0,
                    CostPrice = 200.00m,
                    ExpiryDate = new DateTime(2025, 1, 1),
                    IsActive = false
                }
            );
        }
    }
}