using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetAllAsync();

        Task<Brand?> GetByIdAsync(int id);

        Task<Brand?> GetByIdWithItemsAsync(int id);

        Task AddAsync(Brand brand);

        Task UpdateAsync(Brand brand);

        Task DeleteAsync(Brand brand);

        Task<bool> ExistsByNameAsync(string name, int? excludeId = null);
    }
}