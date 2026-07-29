using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class AddExpiryDateToSupplierDeliveryItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "SupplierDeliveryItems",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "SupplierDeliveryItems");
        }
    }
}
