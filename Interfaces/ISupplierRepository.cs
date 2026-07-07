using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface ISupplierRepository
    {
        Task<IEnumerable<Supplier>> GetAllActiveAsync();
        Task<Supplier?> GetByIdAsync(int id);
        Task AddAsync(Supplier supplier);
        Task UpdateAsync(Supplier supplier);
        Task DeactivateAsync(int id);
    }
}