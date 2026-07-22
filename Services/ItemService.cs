using JelycoWarehouse.DTOs.Items;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class ItemService
    {
        private readonly IItemRepository _itemRepo;

        public ItemService(IItemRepository itemRepo)
        {
            _itemRepo = itemRepo;
        }

        public async Task<IEnumerable<ItemDto>> GetAllAsync()
        {
            var items = await _itemRepo.GetAllActiveAsync();

            return items.Select(MapToDto);
        }

        public async Task<int> CountActiveAsync()
        {
            return await _itemRepo.CountActiveAsync();
        }

        public async Task<ItemDto?> GetByIdAsync(int id)
        {
            var item = await _itemRepo.GetByIdAsync(id);

            if (item == null)
                return null;

            return MapToDto(item);
        }

        public async Task<Item?> GetEntityByIdAsync(int id)
        {
            return await _itemRepo.GetByIdAsync(id);
        }

        public async Task AddAsync(Item item)
        {
            item.Name = item.Name.Trim();

            if (string.IsNullOrWhiteSpace(item.Name))
                throw new InvalidOperationException("Item name is required.");

            if (item.CostPrice < 0)
                throw new InvalidOperationException("Cost price cannot be negative.");

            if (item.ReorderLevel < 0)
                throw new InvalidOperationException("Reorder level cannot be negative.");

            await _itemRepo.AddAsync(item);
        }

        public async Task UpdateAsync(Item item)
        {
            item.Name = item.Name.Trim();

            if (string.IsNullOrWhiteSpace(item.Name))
                throw new InvalidOperationException("Item name is required.");

            if (item.CostPrice < 0)
                throw new InvalidOperationException("Cost price cannot be negative.");

            if (item.ReorderLevel < 0)
                throw new InvalidOperationException("Reorder level cannot be negative.");

            await _itemRepo.UpdateAsync(item);
        }

        public async Task DeactivateAsync(int id)
        {
            await _itemRepo.DeactivateAsync(id);
        }

        private static ItemDto MapToDto(Item item)
        {
            return new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                BrandId = item.BrandId,
                Brand = item.Brand?.Name ?? string.Empty,
                Kind = item.Kind,
                Size = item.Size,
                Color = item.Color,
                Category = item.Category,
                Quantity = item.Quantity,
                ReorderLevel = item.ReorderLevel,
                CostPrice = item.CostPrice,
                ExpiryDate = item.ExpiryDate,
                IsActive = item.IsActive
            };
        }
    }
}