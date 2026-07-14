using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface IWarehouseReleaseRepository
    {
        Task<IEnumerable<WarehouseRelease>> GetAllAsync();

        Task<WarehouseRelease?> GetByIdAsync(int id);

        Task AddAsync(WarehouseRelease release);

        Task UpdateAsync(WarehouseRelease release);

        Task DeleteAsync(WarehouseRelease release);
    }
}