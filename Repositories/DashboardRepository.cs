using JelycoWarehouse.DTOs.Dashboard;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly WarehouseContext _context;

        public DashboardRepository(
            WarehouseContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetDashboardAsync()
        {
            var totalItems =
                await _context.Items.CountAsync();

            var totalStock =
                await _context.Items.SumAsync(i => i.Quantity);

            var inventoryValue =
                await _context.Items.SumAsync(i =>
                    i.Quantity * i.CostPrice);

            var lowStockItems =
                await _context.Items.CountAsync(i =>
                    i.Quantity <= i.ReorderLevel);

            var totalIn =
                await _context.Transactions
                    .Where(t => t.Type == Enums.TransactionType.IN)
                    .SumAsync(t => t.Quantity);

            var totalOut =
                await _context.Transactions
                    .Where(t => t.Type == Enums.TransactionType.OUT)
                    .SumAsync(t => t.Quantity);

            return new DashboardDto
            {
                TotalItems = totalItems,
                TotalStock = totalStock,
                InventoryValue = inventoryValue,
                LowStockItems = lowStockItems,
                TotalIn = totalIn,
                TotalOut = totalOut
            };
        }
    }
}