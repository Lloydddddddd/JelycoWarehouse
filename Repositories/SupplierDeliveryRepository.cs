using JelycoWarehouse.Models;
using JelycoWarehouse.Interfaces;
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

        public async Task<IEnumerable<SupplierDelivery>> GetAllAsync() =>
            await _context.SupplierDeliveries
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                .ThenInclude(i => i.Item)
                .Include(d => d.Transactions)
                .ToListAsync();

        public async Task<SupplierDelivery?> GetByIdAsync(int id) =>
            await _context.SupplierDeliveries
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                .ThenInclude(i => i.Item)
                .Include(d => d.Transactions)
                .FirstOrDefaultAsync(d => d.Id == id);

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
            // Delete all delivery items first
            _context.SupplierDeliveryItems.RemoveRange(delivery.Items);

            // Then delete the delivery
            _context.SupplierDeliveries.Remove(delivery);

            await _context.SaveChangesAsync();
        }
    }
}