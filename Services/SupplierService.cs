using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class SupplierService
    {
        private readonly ISupplierRepository _supplierRepo;

        public SupplierService(ISupplierRepository supplierRepo)
        {
            _supplierRepo = supplierRepo;
        }

        public async Task<IEnumerable<Supplier>> GetAllAsync()
        {
            return await _supplierRepo.GetAllActiveAsync();
        }

        public async Task<int> CountActiveAsync()
        {
            return await _supplierRepo.CountActiveAsync();
        }

        public async Task<Supplier?> GetByIdAsync(int id)
        {
            return await _supplierRepo.GetByIdAsync(id);
        }

        public async Task AddAsync(Supplier supplier)
        {
            supplier.Name = supplier.Name.Trim();
            supplier.ContactInfo = supplier.ContactInfo.Trim();
            supplier.Address = supplier.Address.Trim();
            supplier.Email = supplier.Email.Trim();

            if (string.IsNullOrWhiteSpace(supplier.Name))
                throw new InvalidOperationException("Supplier name is required.");

            if (string.IsNullOrWhiteSpace(supplier.ContactInfo))
                throw new InvalidOperationException("Contact information is required.");

            if (string.IsNullOrWhiteSpace(supplier.Address))
                throw new InvalidOperationException("Address is required.");

            if (string.IsNullOrWhiteSpace(supplier.Email))
                throw new InvalidOperationException("Email is required.");

            if (await _supplierRepo.ExistsByNameAsync(supplier.Name))
            {
                throw new InvalidOperationException(
                    "A supplier with this name already exists.");
            }

            await _supplierRepo.AddAsync(supplier);
        }

        public async Task UpdateAsync(Supplier supplier)
        {
            supplier.Name = supplier.Name.Trim();
            supplier.ContactInfo = supplier.ContactInfo.Trim();
            supplier.Address = supplier.Address.Trim();
            supplier.Email = supplier.Email.Trim();

            if (string.IsNullOrWhiteSpace(supplier.Name))
                throw new InvalidOperationException("Supplier name is required.");

            if (string.IsNullOrWhiteSpace(supplier.ContactInfo))
                throw new InvalidOperationException("Contact information is required.");

            if (string.IsNullOrWhiteSpace(supplier.Address))
                throw new InvalidOperationException("Address is required.");

            if (string.IsNullOrWhiteSpace(supplier.Email))
                throw new InvalidOperationException("Email is required.");

            if (await _supplierRepo.ExistsByNameAsync(supplier.Name, supplier.Id))
            {
                throw new InvalidOperationException(
                    "A supplier with this name already exists.");
            }

            await _supplierRepo.UpdateAsync(supplier);
        }

        public async Task DeactivateAsync(int id)
        {
            await _supplierRepo.DeactivateAsync(id);
        }
    }
}