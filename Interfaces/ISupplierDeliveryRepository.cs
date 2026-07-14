using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface ISupplierDeliveryRepository
    {
        Task<IEnumerable<SupplierDelivery>> GetAllAsync();

        Task<SupplierDelivery?> GetByIdAsync(int id);

        Task AddAsync(SupplierDelivery delivery);

        Task UpdateAsync(SupplierDelivery delivery);

        // NEW
        Task DeleteAsync(SupplierDelivery delivery);
    }
}