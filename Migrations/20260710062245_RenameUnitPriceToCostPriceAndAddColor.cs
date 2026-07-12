using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class RenameUnitPriceToCostPriceAndAddColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "Items",
                newName: "CostPrice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CostPrice",
                table: "Items",
                newName: "UnitPrice");
        }
    }
}
