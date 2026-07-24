using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class InventoryAdjustmentRepository
        : IInventoryAdjustmentRepository
    {
        private readonly WarehouseContext _context;

        public InventoryAdjustmentRepository(
            WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InventoryAdjustment>> GetAllAsync()
        {
            return await _context.InventoryAdjustments
                .AsNoTracking()
                .Include(a => a.Items)
                    .ThenInclude(i => i.Item)
                .OrderByDescending(a => a.AdjustmentDate)
                .ToListAsync();
        }

        public async Task<InventoryAdjustment?> GetByIdAsync(int id)
        {
            return await _context.InventoryAdjustments
                .AsNoTracking()
                .Include(a => a.Items)
                    .ThenInclude(i => i.Item)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<bool> ExistsByReferenceAsync(string reference, int? excludeId = null)
        {
            var query = _context.InventoryAdjustments.AsQueryable();

            if (excludeId.HasValue)
            {
                query = query.Where(a => a.Id != excludeId.Value);
            }

            return await query.AnyAsync(a => a.AdjustmentReference == reference);
        }

        public async Task AddAsync(
            InventoryAdjustment adjustment)
        {
            _context.InventoryAdjustments.Add(adjustment);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(
            InventoryAdjustment adjustment)
        {
            _context.InventoryAdjustments.Update(adjustment);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(
            InventoryAdjustment adjustment)
        {
            _context.InventoryAdjustmentItems.RemoveRange(
                adjustment.Items);

            _context.InventoryAdjustments.Remove(adjustment);

            await _context.SaveChangesAsync();
        }
    }
}