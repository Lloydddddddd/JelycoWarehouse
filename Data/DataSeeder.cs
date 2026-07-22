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

            // ============================
            // Roles
            // ============================

            string[] roles = { "Admin", "Manager", "Staff", "Viewer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // ============================
            // Admin User
            // ============================

            var adminEmail = "admin@warehouse.com";

            var adminUser =
                await userManager.FindByEmailAsync(adminEmail);

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

            // ============================
            // Brands
            // ============================

            if (!await context.Brands.AnyAsync())
            {
                var brands = new List<Brand>
                {
                    new Brand { Name = "Stanley" },
                    new Brand { Name = "Boysen" },
                    new Brand { Name = "Bosch" },
                    new Brand { Name = "Holcim" },
                    new Brand { Name = "TimberMart" }
                };

                await context.Brands.AddRangeAsync(brands);
                await context.SaveChangesAsync();
            }

            // ============================
            // Suppliers
            // ============================

            if (!await context.Suppliers.AnyAsync())
            {
                var suppliers = new List<Supplier>
                {
                    new Supplier
                    {
                        Name = "ABC Hardware",
                        ContactInfo = "0917-123-4567",
                        Address = "123 Main St",
                        Email = "abc@hardware.com"
                    },
                    new Supplier
                    {
                        Name = "ColorPro Supplies",
                        ContactInfo = "0917-987-6543",
                        Address = "456 Paint Ave",
                        Email = "colorpro@supplies.com"
                    },
                    new Supplier
                    {
                        Name = "ToolWorld",
                        ContactInfo = "0917-555-2222",
                        Address = "789 Tool Rd",
                        Email = "toolworld@warehouse.com"
                    },
                    new Supplier
                    {
                        Name = "BuildMax",
                        ContactInfo = "0917-555-1111",
                        Address = "101 Cement Rd",
                        Email = "buildmax@warehouse.com"
                    },
                    new Supplier
                    {
                        Name = "TimberMart",
                        ContactInfo = "0917-333-4444",
                        Address = "202 Timber St",
                        Email = "timbermart@warehouse.com"
                    }
                };

                await context.Suppliers.AddRangeAsync(suppliers);
                await context.SaveChangesAsync();
            }

            // ============================
            // Items
            // ============================

            if (!await context.Items.AnyAsync())
            {
                var stanley =
                    await context.Brands.FirstAsync(b => b.Name == "Stanley");

                var boysen =
                    await context.Brands.FirstAsync(b => b.Name == "Boysen");

                var bosch =
                    await context.Brands.FirstAsync(b => b.Name == "Bosch");

                var holcim =
                    await context.Brands.FirstAsync(b => b.Name == "Holcim");

                var timberBrand =
                    await context.Brands.FirstAsync(b => b.Name == "TimberMart");

                var items = new List<Item>
                {
                    new Item
                    {
                        Name = "Hammer",
                        BrandId = stanley.Id,
                        Kind = "Claw Hammer",
                        Size = "16oz",
                        Color = "",
                        Category = "Tools",
                        Quantity = 50,
                        CostPrice = 250,
                        ExpiryDate = null,
                        IsActive = true
                    },

                    new Item
                    {
                        Name = "Paint Bucket",
                        BrandId = boysen.Id,
                        Kind = "Latex Paint",
                        Size = "4L",
                        Color = "",
                        Category = "Paints",
                        Quantity = 20,
                        CostPrice = 1200,
                        ExpiryDate = DateTime.Now.AddMonths(6),
                        IsActive = true
                    },

                    new Item
                    {
                        Name = "Screwdriver Set",
                        BrandId = bosch.Id,
                        Kind = "Precision Set",
                        Size = "10 pcs",
                        Color = "",
                        Category = "Tools",
                        Quantity = 15,
                        CostPrice = 800,
                        ExpiryDate = null,
                        IsActive = true
                    },

                    new Item
                    {
                        Name = "Cement Bag",
                        BrandId = holcim.Id,
                        Kind = "Portland Cement",
                        Size = "40kg",
                        Color = "",
                        Category = "Construction",
                        Quantity = 100,
                        CostPrice = 250,
                        ExpiryDate = DateTime.Now.AddMonths(3),
                        IsActive = true
                    },

                    new Item
                    {
                        Name = "Wood Plank",
                        BrandId = timberBrand.Id,
                        Kind = "Pine Wood",
                        Size = "2x4x8 ft",
                        Color = "",
                        Category = "Materials",
                        Quantity = 200,
                        CostPrice = 150,
                        ExpiryDate = null,
                        IsActive = true
                    }
                };

                await context.Items.AddRangeAsync(items);
                await context.SaveChangesAsync();
            }
        }
    }
}