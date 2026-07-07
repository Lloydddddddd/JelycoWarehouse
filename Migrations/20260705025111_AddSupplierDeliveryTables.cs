using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class AddSupplierDeliveryTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SupplierDeliveries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierId = table.Column<int>(type: "int", nullable: false),
                    DeliveryReference = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierDeliveries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierDeliveries_Suppliers_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Suppliers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SupplierDeliveryItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SupplierDeliveryId = table.Column<int>(type: "int", nullable: false),
                    ItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierDeliveryItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierDeliveryItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SupplierDeliveryItems_SupplierDeliveries_SupplierDeliveryId",
                        column: x => x.SupplierDeliveryId,
                        principalTable: "SupplierDeliveries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SupplierDeliveries_SupplierId",
                table: "SupplierDeliveries",
                column: "SupplierId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierDeliveryItems_ItemId",
                table: "SupplierDeliveryItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierDeliveryItems_SupplierDeliveryId",
                table: "SupplierDeliveryItems",
                column: "SupplierDeliveryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupplierDeliveryItems");

            migrationBuilder.DropTable(
                name: "SupplierDeliveries");
        }
    }
}
