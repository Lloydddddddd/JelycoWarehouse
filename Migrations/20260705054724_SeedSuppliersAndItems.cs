using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class SeedSuppliersAndItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SupplierDeliveries_Suppliers_SupplierId",
                table: "SupplierDeliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierDeliveryItems_Items_ItemId",
                table: "SupplierDeliveryItems");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Suppliers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Suppliers",
                columns: new[] { "Id", "Address", "ContactInfo", "Email", "IsActive", "Name" },
                values: new object[,]
                {
                    { 1, "Main St", "123-456", "abc@supplies.com", true, "ABC Supplies" },
                    { 2, "Market Rd", "789-012", "xyz@traders.com", true, "XYZ Traders" },
                    { 3, "Old Rd", "000-000", "inactive@supplier.com", false, "Inactive Supplier" }
                });

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "Id", "Brand", "Category", "ExpiryDate", "IsActive", "Kind", "Name", "Quantity", "ReorderLevel", "Size", "SupplierId", "UnitPrice" },
                values: new object[,]
                {
                    { 1, "ToolCo", "Tools", null, true, "Hand Tool", "Hammer", 50, 10, "Medium", 1, 150.00m },
                    { 2, "FixIt", "Tools", null, true, "Hand Tool", "Screwdriver", 100, 20, "Small", 1, 75.00m },
                    { 3, "ColorMax", "Paints", null, false, "Paint", "Expired Paint", 0, 5, "1L", 2, 200.00m }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierDeliveries_Suppliers_SupplierId",
                table: "SupplierDeliveries",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierDeliveryItems_Items_ItemId",
                table: "SupplierDeliveryItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SupplierDeliveries_Suppliers_SupplierId",
                table: "SupplierDeliveries");

            migrationBuilder.DropForeignKey(
                name: "FK_SupplierDeliveryItems_Items_ItemId",
                table: "SupplierDeliveryItems");

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Items",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Items");

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierDeliveries_Suppliers_SupplierId",
                table: "SupplierDeliveries",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SupplierDeliveryItems_Items_ItemId",
                table: "SupplierDeliveryItems",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
