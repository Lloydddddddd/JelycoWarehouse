using JelycoWarehouse.DTOs.Reports;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class TransactionReportService
    {
        private readonly WarehouseContext _context;

        public TransactionReportService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<TransactionReportDto>> GetTransactionReportAsync()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Item)
                    .ThenInclude(i => i!.Brand)
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return transactions.Select(t => new TransactionReportDto
            {
                TransactionId = t.Id,

                Date = t.Date,

                ItemName = t.Item?.Name ?? string.Empty,

                Brand = t.Item?.Brand?.Name ?? string.Empty,

                TransactionType = t.Type.ToString(),

                Quantity = t.Quantity,

                Reference =
                    t.SupplierDeliveryId != null
                        ? $"Supplier Delivery #{t.SupplierDeliveryId}"
                    : t.WarehouseReleaseId != null
                        ? $"Warehouse Release #{t.WarehouseReleaseId}"
                    : t.InventoryAdjustmentId != null
                        ? $"Inventory Adjustment #{t.InventoryAdjustmentId}"
                    : "Manual"
            }).ToList();
        }
    }
}