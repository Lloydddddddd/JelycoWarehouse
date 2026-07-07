using JelycoWarehouse.Models;
using JelycoWarehouse.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly WarehouseContext _context;
        public ItemRepository(WarehouseContext context) => _context = context;

        public async Task<IEnumerable<Item>> GetAllActiveAsync() =>
            await _context.Items
                          .Include(i => i.Supplier)
                          .Where(i => i.IsActive)
                          .ToListAsync();

        public async Task<Item?> GetByIdAsync(int id) =>
            await _context.Items
                          .Include(i => i.Supplier)
                          .FirstOrDefaultAsync(i => i.Id == id && i.IsActive);

        public async Task AddAsync(Item item)
        {
            _context.Items.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Item item)
        {
            _context.Items.Update(item);
            await _context.SaveChangesAsync();
        }

        public async Task DeactivateAsync(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item != null)
            {
                item.IsActive = false;
                await _context.SaveChangesAsync();
            }
        }
    }
}