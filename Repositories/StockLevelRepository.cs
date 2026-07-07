using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class StockLevelRepository : IStockLevelRepository
    {
        private readonly WarehouseContext _context;

        public StockLevelRepository(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StockLevel>> GetAllAsync() =>
            await _context.StockLevels
                .Include(s => s.Item)
                .Include(s => s.Location)
                .ToListAsync();

        public async Task<StockLevel?> GetByIdAsync(int id) =>
            await _context.StockLevels
                .Include(s => s.Item)
                .Include(s => s.Location)
                .FirstOrDefaultAsync(s => s.Id == id);

        public async Task AddAsync(StockLevel stockLevel)
        {
            _context.StockLevels.Add(stockLevel);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(StockLevel stockLevel)
        {
            _context.StockLevels.Update(stockLevel);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var stockLevel = await _context.StockLevels.FindAsync(id);
            if (stockLevel != null)
            {
                _context.StockLevels.Remove(stockLevel);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<StockLevel?> GetByItemAndLocationAsync(int itemId, int locationId)
        {
            return await _context.StockLevels
                .FirstOrDefaultAsync(sl => sl.ItemId == itemId && sl.LocationId == locationId);
        }

        public async Task UpdateOrAddAsync(StockLevel stockLevel)
        {
            var existing = await GetByItemAndLocationAsync(stockLevel.ItemId, stockLevel.LocationId);
            if (existing == null)
            {
                _context.StockLevels.Add(stockLevel);
            }
            else
            {
                existing.Quantity = stockLevel.Quantity;
                _context.StockLevels.Update(existing);
            }
            await _context.SaveChangesAsync();
        }
    }
}