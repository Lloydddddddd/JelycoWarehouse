using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class TransactionService
    {
        private readonly ITransactionRepository _transactionRepo;
        private readonly IItemRepository _itemRepo;
        private readonly IStockLevelRepository _stockLevelRepo;

        public TransactionService(
            ITransactionRepository transactionRepo,
            IItemRepository itemRepo,
            IStockLevelRepository stockLevelRepo)
        {
            _transactionRepo = transactionRepo;
            _itemRepo = itemRepo;
            _stockLevelRepo = stockLevelRepo;
        }

        public async Task<IEnumerable<Transaction>> GetAllAsync() => await _transactionRepo.GetAllAsync();
        public async Task<Transaction?> GetByIdAsync(int id) => await _transactionRepo.GetByIdAsync(id);

        public async Task AddAsync(Transaction transaction)
        {
            // existing AddAsync logic (adjust item + stock levels, then save transaction)
            var item = await _itemRepo.GetByIdAsync(transaction.ItemId);
            if (item == null)
                throw new InvalidOperationException("Item not found.");

            if (transaction.Type == "IN")
            {
                item.Quantity += transaction.Quantity;
            }
            else if (transaction.Type == "OUT")
            {
                if (item.Quantity < transaction.Quantity)
                    throw new InvalidOperationException("Insufficient stock.");
                item.Quantity -= transaction.Quantity;
            }
            else
            {
                throw new ArgumentException("Transaction type must be 'IN' or 'OUT'.");
            }

            await _itemRepo.UpdateAsync(item);

            var stockLevel = await _stockLevelRepo.GetByItemAndLocationAsync(transaction.ItemId, transaction.LocationId)
                             ?? new StockLevel { ItemId = transaction.ItemId, LocationId = transaction.LocationId, Quantity = 0 };

            if (transaction.Type == "IN")
            {
                stockLevel.Quantity += transaction.Quantity;
            }
            else if (transaction.Type == "OUT")
            {
                if (stockLevel.Quantity < transaction.Quantity)
                    throw new InvalidOperationException("Insufficient stock at this location.");
                stockLevel.Quantity -= transaction.Quantity;
            }

            await _stockLevelRepo.UpdateOrAddAsync(stockLevel);

            await _transactionRepo.AddAsync(transaction);
        }

        public async Task UpdateAsync(Transaction transaction)
        {
            await _transactionRepo.UpdateAsync(transaction);
        }
    }
}