using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class SupplierService
    {
        private readonly ISupplierRepository _supplierRepo;
        public SupplierService(ISupplierRepository supplierRepo) => _supplierRepo = supplierRepo;

        public async Task<IEnumerable<Supplier>> GetAllAsync() => await _supplierRepo.GetAllActiveAsync();
        public async Task<int> CountActiveAsync()
        {
            return await _supplierRepo.CountActiveAsync();
        }
        public async Task<Supplier?> GetByIdAsync(int id) => await _supplierRepo.GetByIdAsync(id);
        public async Task AddAsync(Supplier supplier) => await _supplierRepo.AddAsync(supplier);
        public async Task UpdateAsync(Supplier supplier) => await _supplierRepo.UpdateAsync(supplier);
        public async Task DeactivateAsync(int id) => await _supplierRepo.DeactivateAsync(id);
    }
}