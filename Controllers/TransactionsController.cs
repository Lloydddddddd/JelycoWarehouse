using JelycoWarehouse.DTOs.Dashboard;
using JelycoWarehouse.DTOs.Transactions;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionService _transactionService;

        public TransactionsController(TransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // GET: api/transactions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
        {
            var transactions = await _transactionService.GetAllAsync();

            return Ok(transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                ItemId = t.ItemId,
                ItemName = t.Item?.Name ?? string.Empty,
                Quantity = t.Quantity,
                Type = t.Type.ToString(),
                Date = t.Date
            }));
        }

        // GET: api/transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
        {
            var transaction = await _transactionService.GetByIdAsync(id);

            if (transaction == null)
                return NotFound();

            return Ok(new TransactionDto
            {
                Id = transaction.Id,
                ItemId = transaction.ItemId,
                ItemName = transaction.Item?.Name ?? string.Empty,
                Quantity = transaction.Quantity,
                Type = transaction.Type.ToString(),
                Date = transaction.Date
            });
        }

        // POST: api/transactions
        [HttpPost]
        public async Task<ActionResult<TransactionDto>> PostTransaction(TransactionCreateDto dto)
        {
            var transaction = new Transaction
            {
                ItemId = dto.ItemId,
                Quantity = dto.Quantity,
                Type = dto.Type,
                Date = DateTime.UtcNow
            };

            await _transactionService.AddAsync(transaction);

            return CreatedAtAction(
                nameof(GetTransaction),
                new { id = transaction.Id },
                new TransactionDto
                {
                    Id = transaction.Id,
                    ItemId = transaction.ItemId,
                    ItemName = transaction.Item?.Name ?? string.Empty,
                    Quantity = transaction.Quantity,
                    Type = transaction.Type.ToString(),
                    Date = transaction.Date
                });
        }

        // PUT: api/transactions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, TransactionUpdateDto dto)
        {
            var transaction = await _transactionService.GetByIdAsync(id);

            if (transaction == null)
                return NotFound();

            transaction.ItemId = dto.ItemId;
            transaction.Quantity = dto.Quantity;
            transaction.Type = dto.Type;
            transaction.Date = dto.Date;

            await _transactionService.UpdateAsync(transaction);

            return NoContent();
        }

        // GET: api/transactions/filter
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> Filter(
            int? itemId,
            TransactionType? type,
            DateTime? startDate,
            DateTime? endDate)
        {
            var transactions = await _transactionService.GetFilteredAsync(
                itemId,
                type,
                startDate,
                endDate);

            return Ok(transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                ItemId = t.ItemId,
                ItemName = t.Item?.Name ?? string.Empty,
                Quantity = t.Quantity,
                Type = t.Type.ToString(),
                Date = t.Date
            }));
        }

        // DELETE: api/transactions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _transactionService.DeleteAsync(id);

            return NoContent();
        }

        // GET: api/transactions/dashboard
        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardDto>> GetDashboard()
        {
            var dashboard = await _transactionService.GetDashboardAsync();
            return Ok(dashboard);
        }
    }
}