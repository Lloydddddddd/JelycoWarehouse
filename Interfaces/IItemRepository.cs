using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllActiveAsync();
        Task<Item?> GetByIdAsync(int id);
        Task AddAsync(Item item);
        Task UpdateAsync(Item item);
        Task DeactivateAsync(int id);
    }
}