using JelycoWarehouse.DTOs.Brands;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class BrandService
    {
        private readonly IBrandRepository _brandRepository;

        public BrandService(IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
        }

        public async Task<IEnumerable<BrandDto>> GetAllAsync()
        {
            var brands = await _brandRepository.GetAllAsync();

            return brands.Select(b => new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
                IsActive = b.IsActive
            });
        }

        public async Task<BrandDto?> GetByIdAsync(int id)
        {
            var brand = await _brandRepository.GetByIdAsync(id);

            if (brand == null)
                return null;

            return new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                IsActive = brand.IsActive
            };
        }

        public async Task<BrandDto> AddAsync(BrandCreateDto dto)
        {
            var name = dto.Name.Trim();

            if (await _brandRepository.ExistsByNameAsync(name))
                throw new InvalidOperationException("A brand with this name already exists.");

            var brand = new Brand
            {
                Name = name,
                IsActive = true
            };

            await _brandRepository.AddAsync(brand);

            return new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                IsActive = brand.IsActive
            };
        }

        public async Task UpdateAsync(int id, BrandUpdateDto dto)
        {
            var brand = await _brandRepository.GetByIdAsync(id);

            if (brand == null)
                throw new KeyNotFoundException("Brand not found.");

            var name = dto.Name.Trim();

            if (await _brandRepository.ExistsByNameAsync(name, id))
            {
                throw new InvalidOperationException(
                    "A brand with this name already exists.");
            }

            brand.Name = name;
            brand.IsActive = dto.IsActive;

            await _brandRepository.UpdateAsync(brand);
        }

        public async Task DeleteAsync(int id)
        {
            var brand = await _brandRepository.GetByIdWithItemsAsync(id);

            if (brand == null)
                throw new KeyNotFoundException("Brand not found.");

            if (brand.Items.Any())
                throw new InvalidOperationException("Cannot delete a brand that is being used by items.");

            await _brandRepository.DeleteAsync(brand);
        }
    }
}