using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly WarehouseContext _context;

        public SupplierRepository(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Supplier>> GetAllActiveAsync()
        {
            return await _context.Suppliers
                .AsNoTracking()
                .Include(s => s.Items)
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<int> CountActiveAsync()
        {
            return await _context.Suppliers
                .CountAsync(s => s.IsActive);
        }

        public async Task<bool> ExistsByNameAsync(string name, int? excludeId = null)
        {
            var query = _context.Suppliers
                .Where(s => s.IsActive);

            if (excludeId.HasValue)
            {
                query = query.Where(s => s.Id != excludeId.Value);
            }

            return await query.AnyAsync(s => s.Name == name);
        }

        public async Task<Supplier?> GetByIdAsync(int id)
        {
            return await _context.Suppliers
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.Id == id && s.IsActive);
        }

        public async Task AddAsync(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Supplier supplier)
        {
            _context.Suppliers.Update(supplier);
            await _context.SaveChangesAsync();
        }

        public async Task DeactivateAsync(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);

            if (supplier == null)
                throw new KeyNotFoundException("Supplier not found.");

            supplier.IsActive = false;

            await _context.SaveChangesAsync();
        }
    }
}