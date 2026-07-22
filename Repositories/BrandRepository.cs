using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class BrandRepository : IBrandRepository
    {
        private readonly WarehouseContext _context;

        public BrandRepository(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brand>> GetAllAsync()
        {
            return await _context.Brands
                .AsNoTracking()
                .OrderBy(b => b.Name)
                .ToListAsync();
        }

        public async Task<Brand?> GetByIdAsync(int id)
        {
            return await _context.Brands
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Brand?> GetByIdWithItemsAsync(int id)
        {
            return await _context.Brands
                .Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
        {
            var query = _context.Brands.AsQueryable();

            if (excludeId.HasValue)
            {
                query = query.Where(b => b.Id != excludeId.Value);
            }

            return await query.AnyAsync(b => b.Name == name);
        }

        public async Task AddAsync(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Brand brand)
        {
            _context.Brands.Update(brand);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Brand brand)
        {
            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();
        }
    }
}