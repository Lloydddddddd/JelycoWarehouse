using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface ISupplierDeliveryRepository
    {
        Task<IEnumerable<SupplierDelivery>> GetAllAsync();

        Task<SupplierDelivery?> GetByIdAsync(int id);

        Task<bool> ExistsByReferenceAsync(string reference, int? excludeId = null);

        Task AddAsync(SupplierDelivery delivery);

        Task UpdateAsync(SupplierDelivery delivery);

        Task DeleteAsync(SupplierDelivery delivery);
    }
}