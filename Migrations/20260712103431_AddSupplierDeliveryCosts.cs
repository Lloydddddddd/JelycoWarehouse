using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class AddSupplierDeliveryCosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalCost",
                table: "SupplierDeliveryItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "UnitCost",
                table: "SupplierDeliveryItems",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "GrandTotal",
                table: "SupplierDeliveries",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCost",
                table: "SupplierDeliveryItems");

            migrationBuilder.DropColumn(
                name: "UnitCost",
                table: "SupplierDeliveryItems");

            migrationBuilder.DropColumn(
                name: "GrandTotal",
                table: "SupplierDeliveries");
        }
    }
}
