using JelycoWarehouse.DTOs.Dashboard;
using JelycoWarehouse.DTOs.Transactions;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
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
            var dtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                ItemId = t.ItemId,
                ItemName = t.Item?.Name ?? string.Empty,
                LocationId = t.LocationId,
                LocationName = t.Location?.Name ?? string.Empty,
                Quantity = t.Quantity,
                Type = t.Type.ToString(),
                Date = t.Date
            });
            return Ok(dtos);
        }

        // GET: api/transactions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
        {
            var transaction = await _transactionService.GetByIdAsync(id);
            if (transaction == null) return NotFound();

            var dto = new TransactionDto
            {
                Id = transaction.Id,
                ItemId = transaction.ItemId,
                ItemName = transaction.Item?.Name ?? string.Empty,
                LocationId = transaction.LocationId,
                LocationName = transaction.Location?.Name ?? string.Empty,
                Quantity = transaction.Quantity,
                Type = transaction.Type.ToString(),
                Date = transaction.Date
            };
            return Ok(dto);
        }

        // POST: api/transactions
        [HttpPost]
        public async Task<ActionResult<TransactionDto>> PostTransaction(TransactionCreateDto dto)
        {
            var transaction = new Transaction
            {
                ItemId = dto.ItemId,
                LocationId = dto.LocationId,
                Quantity = dto.Quantity,
                Type = dto.Type,
                Date = DateTime.UtcNow
            };

            await _transactionService.AddAsync(transaction);

            var resultDto = new TransactionDto
            {
                Id = transaction.Id,
                ItemId = transaction.ItemId,
                ItemName = transaction.Item?.Name ?? string.Empty,
                LocationId = transaction.LocationId,
                LocationName = transaction.Location?.Name ?? string.Empty,
                Quantity = transaction.Quantity,
                Type = transaction.Type.ToString(),
                Date = transaction.Date
            };

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, resultDto);
        }

        // PUT: api/transactions/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, TransactionUpdateDto dto)
        {
            var transaction = await _transactionService.GetByIdAsync(id);
            if (transaction == null) return NotFound();

            transaction.ItemId = dto.ItemId;
            transaction.LocationId = dto.LocationId;
            transaction.Quantity = dto.Quantity;
            transaction.Type = dto.Type;
            transaction.Date = dto.Date;

            await _transactionService.UpdateAsync(transaction);
            return NoContent();
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> Filter(
            int? itemId,
            TransactionType? type,
            DateTime? startDate,
            DateTime? endDate)
        {
            var transactions = await _transactionService.GetFilteredAsync(itemId, type, startDate, endDate);

            var result = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                ItemId = t.ItemId,
                ItemName = t.Item?.Name ?? "",
                LocationId = t.LocationId,
                LocationName = t.Location?.Name ?? "",
                Quantity = t.Quantity,
                Type = t.Type.ToString(),
                Date = t.Date
            });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _transactionService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<DashboardDto>> GetDashboard()
        {
            var data = await _transactionService.GetDashboardAsync();
            return Ok(data);
        }
    }
}