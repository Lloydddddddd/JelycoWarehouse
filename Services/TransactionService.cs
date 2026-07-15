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
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // =========================
        // ADD
        // =========================

        public async Task AddAsync(Transaction transaction)
        {
            using var dbTransaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                ValidateTransaction(transaction);

                var item = await _context.Items.FindAsync(transaction.ItemId);

                if (item == null)
                    throw new Exception("Item not found");

                ApplyStockChange(
                    item,
                    transaction.Type,
                    transaction.Quantity);

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
        // UPDATE
        // =========================

        public async Task UpdateAsync(Transaction updated)
        {
            using var dbTransaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var existing =
                    await _context.Transactions
                        .AsNoTracking()
                        .FirstOrDefaultAsync(t => t.Id == updated.Id);

                if (existing == null)
                    throw new Exception("Transaction not found");

                ValidateTransaction(updated);

                var oldItem =
                    await _context.Items.FindAsync(existing.ItemId)
                    ?? throw new Exception("Old item not found");

                var newItem =
                    await _context.Items.FindAsync(updated.ItemId)
                    ?? throw new Exception("New item not found");

                ReverseStockChange(
                    oldItem,
                    existing.Type,
                    existing.Quantity);

                ApplyStockChange(
                    newItem,
                    updated.Type,
                    updated.Quantity);

                _context.Transactions.Update(updated);

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
        // DELETE
        // =========================

        public async Task DeleteAsync(int id)
        {
            using var dbTransaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var transaction =
                    await _context.Transactions.FindAsync(id);

                if (transaction == null)
                    throw new Exception("Transaction not found");

                var item =
                    await _context.Items.FindAsync(transaction.ItemId)
                    ?? throw new Exception("Item not found");

                ReverseStockChange(
                    item,
                    transaction.Type,
                    transaction.Quantity);

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
            var query =
                _context.Transactions
                    .Include(t => t.Item)
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
            var totalItems =
                await _context.Items.CountAsync();

            var totalStock =
                await _context.Items
                    .Select(i => (int?)i.Quantity)
                    .SumAsync() ?? 0;

            var totalIn =
                await _context.Transactions
                    .Where(t => t.Type == TransactionType.IN)
                    .Select(t => (int?)t.Quantity)
                    .SumAsync() ?? 0;

            var totalOut =
                await _context.Transactions
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
        // CURRENT STOCK
        // =========================

        public async Task<int> GetCurrentStockAsync(int itemId)
        {
            var item =
                await _context.Items
                    .FirstOrDefaultAsync(i => i.Id == itemId);

            if (item == null)
                throw new Exception("Item not found");

            return item.Quantity;
        }

        // =========================
        // HELPERS
        // =========================

        private void ValidateTransaction(
            Transaction transaction)
        {
            if (transaction.Quantity <= 0)
                throw new Exception(
                    "Quantity must be greater than zero");

            if (!Enum.IsDefined(
                typeof(TransactionType),
                transaction.Type))
            {
                throw new Exception(
                    "Invalid transaction type");
            }
        }

        private void ApplyStockChange(
            Item item,
            TransactionType type,
            int quantity)
        {
            switch (type)
            {
                case TransactionType.IN:

                    item.Quantity += quantity;

                    break;

                case TransactionType.OUT:

                    if (item.Quantity < quantity)
                        throw new Exception(
                            $"Not enough stock. Available: {item.Quantity}");

                    item.Quantity -= quantity;

                    break;
            }
        }

        private void ReverseStockChange(
            Item item,
            TransactionType type,
            int quantity)
        {
            switch (type)
            {
                case TransactionType.IN:

                    if (item.Quantity < quantity)
                        throw new Exception(
                            "Stock inconsistency detected");

                    item.Quantity -= quantity;

                    break;

                case TransactionType.OUT:

                    item.Quantity += quantity;

                    break;
            }
        }
    }
}