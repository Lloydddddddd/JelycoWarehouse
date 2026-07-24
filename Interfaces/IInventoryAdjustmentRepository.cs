using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface IInventoryAdjustmentRepository
    {
        Task<IEnumerable<InventoryAdjustment>> GetAllAsync();

        Task<InventoryAdjustment?> GetByIdAsync(int id);

        Task<bool> ExistsByReferenceAsync(string reference, int? excludeId = null);

        Task AddAsync(InventoryAdjustment adjustment);

        Task UpdateAsync(InventoryAdjustment adjustment);

        Task DeleteAsync(InventoryAdjustment adjustment);
    }
}