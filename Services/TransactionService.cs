using JelycoWarehouse.DTOs.Dashboard;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class TransactionService
    {
        private readonly WarehouseContext _context;

        public TransactionService(WarehouseContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // =========================
        public async Task<List<Transaction>> GetAllAsync()
        {
            return await _context.Transactions
                .Include(t => t.Item)
                .Include(t => t.Location)
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        // =========================
        // GET BY ID
        // =========================
        public async Task<Transaction?> GetByIdAsync(int id)
        {
            return await _context.Transactions
                .Include(t => t.Item)
                .Include(t => t.Location)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // =========================
        // ADD TRANSACTION
        // =========================
        public async Task AddAsync(Transaction transaction)
        {
            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            try
            {
                ValidateTransaction(transaction);

                // Validate item
                var item = await _context.Items.FindAsync(transaction.ItemId);
                if (item == null)
                    throw new Exception("Item not found");

                // Validate location
                var location = await _context.Locations.FindAsync(transaction.LocationId);
                if (location == null)
                    throw new Exception("Location not found");

                var stock = await GetOrCreateStock(transaction.ItemId, transaction.LocationId);

                ApplyStockChange(stock, transaction.Type, transaction.Quantity);

                _context.Transactions.Add(transaction);

                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();
            }
            catch
            {
                await dbTransaction.RollbackAsync();
                throw;
            }
        }

        // =========================
        // UPDATE TRANSACTION (FIXED)
        // =========================
        public async Task UpdateAsync(Transaction updated)
        {
            var existing = await _context.Transactions
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == updated.Id);

            if (existing == null)
                throw new Exception("Transaction not found");

            ValidateTransaction(updated);

            // STEP 1: REVERSE OLD TRANSACTION EFFECT
            var oldStock = await GetOrCreateStock(existing.ItemId, existing.LocationId);
            ReverseStockChange(oldStock, existing.Type, existing.Quantity);

            // STEP 2: APPLY NEW TRANSACTION EFFECT
            var newStock = await GetOrCreateStock(updated.ItemId, updated.LocationId);
            ApplyStockChange(newStock, updated.Type, updated.Quantity);

            // STEP 3: UPDATE TRANSACTION
            _context.Transactions.Update(updated);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var transaction = await _context.Transactions.FindAsync(id);

                if (transaction == null)
                    throw new Exception("Transaction not found");

                var stock = await GetOrCreateStock(transaction.ItemId, transaction.LocationId);

                // Reverse effect
                ReverseStockChange(stock, transaction.Type, transaction.Quantity);

                _context.Transactions.Remove(transaction);

                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();
            }
            catch
            {
                await dbTransaction.RollbackAsync();
                throw;
            }
        }

        // =========================
        // FILTER
        // =========================
        public async Task<List<Transaction>> GetFilteredAsync(
            int? itemId,
            TransactionType? type,
            DateTime? startDate,
            DateTime? endDate)
        {
            var query = _context.Transactions
                .Include(t => t.Item)
                .Include(t => t.Location)
                .AsQueryable();

            if (itemId.HasValue)
                query = query.Where(t => t.ItemId == itemId.Value);

            if (type.HasValue)
                query = query.Where(t => t.Type == type.Value);

            if (startDate.HasValue)
                query = query.Where(t => t.Date >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(t => t.Date <= endDate.Value);

            return await query
                .OrderByDescending(t => t.Date)
                .ToListAsync();
        }

        // =========================
        // DASHBOARD
        // =========================
        public async Task<DashboardDto> GetDashboardAsync()
        {
            var totalItems = await _context.Items.CountAsync();

            var totalStock = await _context.StockLevels
                .Select(s => (int?)s.Quantity)
                .SumAsync() ?? 0;

            var totalIn = await _context.Transactions
                .Where(t => t.Type == TransactionType.IN)
                .Select(t => (int?)t.Quantity)
                .SumAsync() ?? 0;

            var totalOut = await _context.Transactions
                .Where(t => t.Type == TransactionType.OUT)
                .Select(t => (int?)t.Quantity)
                .SumAsync() ?? 0;

            return new DashboardDto
            {
                TotalItems = totalItems,
                TotalStock = totalStock,
                TotalIn = totalIn,
                TotalOut = totalOut
            };
        }

        // =========================
        // HELPERS
        // =========================

        private void ValidateTransaction(Transaction transaction)
        {
            if (transaction.Quantity <= 0)
                throw new Exception("Quantity must be greater than zero");

            if (!Enum.IsDefined(typeof(TransactionType), transaction.Type))
                throw new Exception("Invalid transaction type");
        }

        private async Task<StockLevel> GetOrCreateStock(int itemId, int locationId)
        {
            var stock = await _context.StockLevels
                .FirstOrDefaultAsync(s => s.ItemId == itemId && s.LocationId == locationId);

            if (stock == null)
            {
                stock = new StockLevel
                {
                    ItemId = itemId,
                    LocationId = locationId,
                    Quantity = 0
                };

                _context.StockLevels.Add(stock);
            }

            return stock;
        }

        private void ApplyStockChange(StockLevel stock, TransactionType type, int quantity)
        {
            switch (type)
            {
                case TransactionType.IN:
                    stock.Quantity += quantity;
                    break;

                case TransactionType.OUT:
                    if (stock.Quantity < quantity)
                        throw new Exception($"Not enough stock. Available: {stock.Quantity}");

                    stock.Quantity -= quantity;
                    break;
            }
        }

        private void ReverseStockChange(StockLevel stock, TransactionType type, int quantity)
        {
            switch (type)
            {
                case TransactionType.IN:
                    if (stock.Quantity < quantity)
                        throw new Exception("Stock inconsistency detected");

                    stock.Quantity -= quantity;
                    break;

                case TransactionType.OUT:
                    stock.Quantity += quantity;
                    break;
            }
        }
    }
}