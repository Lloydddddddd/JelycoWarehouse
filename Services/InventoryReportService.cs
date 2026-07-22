using JelycoWarehouse.DTOs.Reports;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class InventoryReportService
    {
        private readonly WarehouseContext _context;

        public InventoryReportService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<InventoryReportDto>> GetInventoryReportAsync()
        {
            var items = await _context.Items
                .Include(i => i.Brand)
                .Where(i => i.IsActive)
                .OrderBy(i => i.Name)
                .ToListAsync();

            return items.Select(item => new InventoryReportDto
            {
                ItemId = item.Id,
                ItemName = item.Name,
                Brand = item.Brand?.Name ?? string.Empty,
                Category = item.Category,
                Kind = item.Kind,
                Size = item.Size,
                Color = item.Color,
                CurrentStock = item.Quantity,
                ReorderLevel = item.ReorderLevel,
                UnitCost = item.CostPrice,
                StockValue = item.Quantity * item.CostPrice,
                Status = item.Quantity == 0
                    ? "Out of Stock"
                    : item.Quantity <= item.ReorderLevel
                        ? "Low Stock"
                        : "In Stock",
                ExpiryDate = item.ExpiryDate
            }).ToList();
        }
    }
}