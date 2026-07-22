using JelycoWarehouse.DTOs.Reports;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class LowStockReportService
    {
        private readonly WarehouseContext _context;

        public LowStockReportService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<LowStockReportDto>> GetLowStockReportAsync()
        {
            return await _context.Items
                .Include(i => i.Brand)
                .Where(i => i.Quantity <= i.ReorderLevel)
                .OrderBy(i => i.Quantity)
                .Select(i => new LowStockReportDto
                {
                    ItemId = i.Id,
                    ItemName = i.Name,
                    Brand = i.Brand != null ? i.Brand.Name : string.Empty,
                    Category = i.Category,
                    CurrentStock = i.Quantity,
                    ReorderLevel = i.ReorderLevel,
                    Status = i.Quantity == 0
                        ? "Out of Stock"
                        : "Low Stock"
                })
                .ToListAsync();
        }
    }
}