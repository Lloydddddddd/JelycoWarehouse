using JelycoWarehouse.DTOs.InventoryAdjustments;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class InventoryAdjustmentService
    {
        private readonly IInventoryAdjustmentRepository _adjustmentRepo;
        private readonly TransactionService _transactionService;
        private readonly IItemRepository _itemRepo;

        public InventoryAdjustmentService(
            IInventoryAdjustmentRepository adjustmentRepo,
            IItemRepository itemRepo,
            TransactionService transactionService)
        {
            _adjustmentRepo = adjustmentRepo;
            _itemRepo = itemRepo;
            _transactionService = transactionService;
        }

        public async Task<IEnumerable<InventoryAdjustmentDto>> GetAllAsync()
        {
            var adjustments = await _adjustmentRepo.GetAllAsync();

            return adjustments.Select(a => new InventoryAdjustmentDto
            {
                Id = a.Id,
                AdjustmentReference = a.AdjustmentReference,
                AdjustmentDate = a.AdjustmentDate,
                Reason = a.Reason,

                Items = a.Items.Select(i => new InventoryAdjustmentItemDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.Item?.Name ?? string.Empty,
                    SystemQuantity = i.SystemQuantity,
                    ActualQuantity = i.ActualQuantity,
                    Difference = i.Difference
                }).ToList()
            });
        }

        public async Task<InventoryAdjustmentDto?> GetByIdAsync(int id)
        {
            var adjustment = await _adjustmentRepo.GetByIdAsync(id);

            if (adjustment == null)
                return null;

            return new InventoryAdjustmentDto
            {
                Id = adjustment.Id,
                AdjustmentReference = adjustment.AdjustmentReference,
                AdjustmentDate = adjustment.AdjustmentDate,
                Reason = adjustment.Reason,

                Items = adjustment.Items.Select(i => new InventoryAdjustmentItemDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.Item?.Name ?? string.Empty,
                    SystemQuantity = i.SystemQuantity,
                    ActualQuantity = i.ActualQuantity,
                    Difference = i.Difference
                }).ToList()
            };
        }

        public async Task<InventoryAdjustmentDto> AddAsync(
    InventoryAdjustmentCreateDto dto)
        {
            dto.Reason = dto.Reason.Trim();

            if (string.IsNullOrWhiteSpace(dto.Reason))
                throw new InvalidOperationException(
                    "Reason is required.");

            if (dto.Items.Count == 0)
                throw new InvalidOperationException(
                    "An inventory adjustment must contain at least one item.");

            // Prevent the same item from appearing twice
            var duplicateItems = dto.Items
                .GroupBy(i => i.ItemId)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (duplicateItems.Any())
            {
                throw new InvalidOperationException(
                    $"Duplicate item(s) found in adjustment: {string.Join(", ", duplicateItems)}");
            }

            var adjustment = new InventoryAdjustment
            {
                AdjustmentReference = await GenerateAdjustmentReferenceAsync(),
                AdjustmentDate = dto.AdjustmentDate,
                Reason = dto.Reason
            };

            foreach (var dtoItem in dto.Items)
            {
                var item = await _itemRepo.GetByIdAsync(dtoItem.ItemId);

                if (item == null)
                    throw new KeyNotFoundException(
                        $"Item {dtoItem.ItemId} was not found.");

                if (dtoItem.ActualQuantity < 0)
                    throw new InvalidOperationException(
                        "Actual quantity cannot be negative.");

                var systemQuantity =
                    await _transactionService.GetCurrentStockAsync(dtoItem.ItemId);

                var difference =
                    dtoItem.ActualQuantity - systemQuantity;

                adjustment.Items.Add(new InventoryAdjustmentItem
                {
                    ItemId = dtoItem.ItemId,
                    SystemQuantity = systemQuantity,
                    ActualQuantity = dtoItem.ActualQuantity,
                    Difference = difference
                });
            }

            await _adjustmentRepo.AddAsync(adjustment);

            foreach (var item in adjustment.Items)
            {
                if (item.Difference == 0)
                    continue;

                await _transactionService.AddAsync(
                    new Transaction
                    {
                        ItemId = item.ItemId,
                        Quantity = Math.Abs(item.Difference),
                        Type = item.Difference > 0
                            ? TransactionType.IN
                            : TransactionType.OUT,
                        Date = adjustment.AdjustmentDate,
                        InventoryAdjustmentId = adjustment.Id
                    });
            }

            return new InventoryAdjustmentDto
            {
                Id = adjustment.Id,
                AdjustmentReference = adjustment.AdjustmentReference,
                AdjustmentDate = adjustment.AdjustmentDate,
                Reason = adjustment.Reason,

                Items = adjustment.Items.Select(i => new InventoryAdjustmentItemDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.Item?.Name ?? string.Empty,
                    SystemQuantity = i.SystemQuantity,
                    ActualQuantity = i.ActualQuantity,
                    Difference = i.Difference
                }).ToList()
            };
        }

        private async Task<string> GenerateAdjustmentReferenceAsync()
        {
            var adjustments = await _adjustmentRepo.GetAllAsync();

            var nextNumber = adjustments.Any()
                ? adjustments.Max(a => a.Id) + 1
                : 1;

            return $"IA-{nextNumber:D4}";
        }

        public async Task DeleteAsync(int id)
        {
            var adjustment =
                await _adjustmentRepo.GetByIdAsync(id);

            if (adjustment == null)
                throw new KeyNotFoundException("Inventory adjustment not found.");

            await _adjustmentRepo.DeleteAsync(adjustment);
        }
    }
}