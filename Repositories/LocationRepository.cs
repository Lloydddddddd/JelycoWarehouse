using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly WarehouseContext _context;

        public LocationRepository(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Location>> GetAllAsync() =>
            await _context.Locations.ToListAsync();

        public async Task<Location?> GetByIdAsync(int id) =>
            await _context.Locations.FindAsync(id);

        public async Task AddAsync(Location location)
        {
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Location location)
        {
            _context.Locations.Update(location);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var location = await _context.Locations.FindAsync(id);
            if (location != null)
            {
                _context.Locations.Remove(location);
                await _context.SaveChangesAsync();
            }
        }
    }
}