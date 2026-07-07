using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class ItemService
    {
        private readonly IItemRepository _itemRepo;
        public ItemService(IItemRepository itemRepo) => _itemRepo = itemRepo;

        public async Task<IEnumerable<Item>> GetAllAsync() => await _itemRepo.GetAllActiveAsync();
        public async Task<Item?> GetByIdAsync(int id) => await _itemRepo.GetByIdAsync(id);
        public async Task AddAsync(Item item) => await _itemRepo.AddAsync(item);
        public async Task UpdateAsync(Item item) => await _itemRepo.UpdateAsync(item);
        public async Task DeactivateAsync(int id) => await _itemRepo.DeactivateAsync(id);
    }
}