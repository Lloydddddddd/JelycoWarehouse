using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class SupplierDeliveryRepository : ISupplierDeliveryRepository
    {
        private readonly WarehouseContext _context;

        public SupplierDeliveryRepository(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SupplierDelivery>> GetAllAsync()
        {
            return await _context.SupplierDeliveries
                .AsNoTracking()
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                    .ThenInclude(i => i.Item)
                .Include(d => d.Transactions)
                .OrderByDescending(d => d.DeliveryDate)
                .ToListAsync();
        }

        public async Task<SupplierDelivery?> GetByIdAsync(int id)
        {
            return await _context.SupplierDeliveries
                .AsNoTracking()
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                    .ThenInclude(i => i.Item)
                .Include(d => d.Transactions)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<bool> ExistsByReferenceAsync(string reference, int? excludeId = null)
        {
            var query = _context.SupplierDeliveries.AsQueryable();

            if (excludeId.HasValue)
            {
                query = query.Where(d => d.Id != excludeId.Value);
            }

            return await query.AnyAsync(d => d.DeliveryReference == reference);
        }

        public async Task AddAsync(SupplierDelivery delivery)
        {
            _context.SupplierDeliveries.Add(delivery);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SupplierDelivery delivery)
        {
            _context.SupplierDeliveries.Update(delivery);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(SupplierDelivery delivery)
        {
            _context.SupplierDeliveryItems.RemoveRange(delivery.Items);

            _context.SupplierDeliveries.Remove(delivery);

            await _context.SaveChangesAsync();
        }
    }
}