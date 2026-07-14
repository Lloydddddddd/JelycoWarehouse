using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JelycoWarehouse.Migrations
{
    /// <inheritdoc />
    public partial class LinkTransactionsToSupplierDeliveries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SupplierDeliveryId",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_SupplierDeliveryId",
                table: "Transactions",
                column: "SupplierDeliveryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_SupplierDeliveries_SupplierDeliveryId",
                table: "Transactions",
                column: "SupplierDeliveryId",
                principalTable: "SupplierDeliveries",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_SupplierDeliveries_SupplierDeliveryId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_SupplierDeliveryId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "SupplierDeliveryId",
                table: "Transactions");
        }
    }
}
