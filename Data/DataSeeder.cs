using JelycoWarehouse.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Data
{
    public static class DataSeeder
    {
        public static async Task Seed(
            WarehouseContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager)
        {
            await context.Database.MigrateAsync();

            // Roles
            string[] roles = { "Admin", "Manager", "Staff", "Viewer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Admin User
            var adminEmail = "admin@warehouse.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Admin"
                };

                await userManager.CreateAsync(adminUser, "Admin123!");
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            // Suppliers
            if (!await context.Suppliers.AnyAsync())
            {
                var suppliers = new List<Supplier>
                {
                    new Supplier { Name = "ABC Hardware", ContactInfo = "0917-123-4567", Address = "123 Main St", Email = "abc@hardware.com" },
                    new Supplier { Name = "ColorPro Supplies", ContactInfo = "0917-987-6543", Address = "456 Paint Ave", Email = "colorpro@supplies.com" },
                    new Supplier { Name = "ToolWorld", ContactInfo = "0917-555-2222", Address = "789 Tool Rd", Email = "toolworld@warehouse.com" },
                    new Supplier { Name = "BuildMax", ContactInfo = "0917-555-1111", Address = "101 Cement Rd", Email = "buildmax@warehouse.com" },
                    new Supplier { Name = "TimberMart", ContactInfo = "0917-333-4444", Address = "202 Timber St", Email = "timbermart@warehouse.com" }
                };

                await context.Suppliers.AddRangeAsync(suppliers);
                await context.SaveChangesAsync();
            }

            // Items
            if (!await context.Items.AnyAsync())
            {
                var hammerSupplier = await context.Suppliers.FirstAsync(s => s.Name == "ABC Hardware");
                var paintSupplier = await context.Suppliers.FirstAsync(s => s.Name == "ColorPro Supplies");
                var screwdriverSupplier = await context.Suppliers.FirstAsync(s => s.Name == "ToolWorld");
                var cementSupplier = await context.Suppliers.FirstAsync(s => s.Name == "BuildMax");
                var timberSupplier = await context.Suppliers.FirstAsync(s => s.Name == "TimberMart");

                var items = new List<Item>
                {
                    new Item { Name = "Hammer", Brand = "Stanley", Kind = "Claw Hammer", Size = "16oz", Category = "Tools", Quantity = 50, CostPrice  = 250, ReorderLevel = 10, SupplierId = hammerSupplier.Id },
                    new Item { Name = "Paint Bucket", Brand = "Boysen", Kind = "Latex Paint", Size = "4L", Category = "Paints", Quantity = 20, CostPrice  = 1200, ReorderLevel = 5, SupplierId = paintSupplier.Id, ExpiryDate = DateTime.Now.AddMonths(6) },
                    new Item { Name = "Screwdriver Set", Brand = "Bosch", Kind = "Precision Set", Size = "10 pcs", Category = "Tools", Quantity = 15, CostPrice  = 800, ReorderLevel = 3, SupplierId = screwdriverSupplier.Id },
                    new Item { Name = "Cement Bag", Brand = "Holcim", Kind = "Portland Cement", Size = "40kg", Category = "Construction", Quantity = 100, CostPrice  = 250, ReorderLevel = 20, SupplierId = cementSupplier.Id, ExpiryDate = DateTime.Now.AddMonths(3) },
                    new Item { Name = "Wood Plank", Brand = "TimberMart", Kind = "Pine Wood", Size = "2x4x8 ft", Category = "Materials", Quantity = 200, CostPrice  = 150, ReorderLevel = 30, SupplierId = timberSupplier.Id }
                };

                await context.Items.AddRangeAsync(items);
                await context.SaveChangesAsync();
            }
        }
    }
}