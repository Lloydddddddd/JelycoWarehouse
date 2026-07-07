using JelycoWarehouse.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JelycoWarehouse.Interfaces
{
    public interface IStockLevelRepository
    {
        Task<IEnumerable<StockLevel>> GetAllAsync();
        Task<StockLevel?> GetByIdAsync(int id);
        Task AddAsync(StockLevel stockLevel);
        Task UpdateAsync(StockLevel stockLevel);
        Task DeleteAsync(int id);
        Task<StockLevel?> GetByItemAndLocationAsync(int itemId, int locationId);
        Task UpdateOrAddAsync(StockLevel stockLevel);
    }
}