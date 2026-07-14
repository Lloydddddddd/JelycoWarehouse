using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class LinkTransactionsToWarehouseReleases : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WarehouseReleaseId",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_WarehouseReleaseId",
                table: "Transactions",
                column: "WarehouseReleaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_WarehouseReleases_WarehouseReleaseId",
                table: "Transactions",
                column: "WarehouseReleaseId",
                principalTable: "WarehouseReleases",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_WarehouseReleases_WarehouseReleaseId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_WarehouseReleaseId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "WarehouseReleaseId",
                table: "Transactions");
        }
    }
}
