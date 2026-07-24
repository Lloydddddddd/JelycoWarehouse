using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class WarehouseReleaseRepository : IWarehouseReleaseRepository
    {
        private readonly WarehouseContext _context;

        public WarehouseReleaseRepository(
            WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WarehouseRelease>> GetAllAsync()
        {
            return await _context.WarehouseReleases
                .AsNoTracking()
                .Include(r => r.Items)
                    .ThenInclude(i => i.Item)
                .OrderByDescending(r => r.ReleaseDate)
                .ToListAsync();
        }

        public async Task<WarehouseRelease?> GetByIdAsync(int id)
        {
            return await _context.WarehouseReleases
                .AsNoTracking()
                .Include(r => r.Items)
                    .ThenInclude(i => i.Item)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<bool> ExistsByReferenceAsync(string reference, int? excludeId = null)
        {
            var query = _context.WarehouseReleases.AsQueryable();

            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            return await query.AnyAsync(r => r.ReleaseReference == reference);
        }

        public async Task AddAsync(WarehouseRelease release)
        {
            _context.WarehouseReleases.Add(release);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(WarehouseRelease release)
        {
            _context.WarehouseReleases.Update(release);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(WarehouseRelease release)
        {
            _context.WarehouseReleaseItems.RemoveRange(release.Items);

            _context.WarehouseReleases.Remove(release);

            await _context.SaveChangesAsync();
        }
    }
}