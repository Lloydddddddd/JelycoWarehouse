using JelycoWarehouse.Models;
using JelycoWarehouse.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly WarehouseContext _context;
        public TransactionRepository(WarehouseContext context) => _context = context;

        public async Task<IEnumerable<Transaction>> GetAllAsync() =>
            await _context.Transactions.Include(t => t.Item).ToListAsync();

        public async Task<Transaction?> GetByIdAsync(int id) =>
            await _context.Transactions.Include(t => t.Item)
                                       .FirstOrDefaultAsync(t => t.Id == id);

        public async Task AddAsync(Transaction transaction)
        {
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Transaction transaction)
        {
            _context.Transactions.Update(transaction);
            await _context.SaveChangesAsync();
        }
    }
}