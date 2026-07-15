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

        public InventoryAdjustmentService(
            IInventoryAdjustmentRepository adjustmentRepo,
            TransactionService transactionService)
        {
            _adjustmentRepo = adjustmentRepo;
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
            var adjustment = new InventoryAdjustment
            {
                AdjustmentReference = await GenerateAdjustmentReferenceAsync(),
                AdjustmentDate = dto.AdjustmentDate,
                Reason = dto.Reason
            };

            foreach (var dtoItem in dto.Items)
            {
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

            // Automatically create adjustment transactions
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
            var adjustments =
                await _adjustmentRepo.GetAllAsync();

            var nextNumber =
                adjustments.Count() + 1;

            return $"IA-{nextNumber:D4}";
        }

        public async Task DeleteAsync(int id)
        {
            var adjustment =
                await _adjustmentRepo.GetByIdAsync(id);

            if (adjustment == null)
                throw new Exception("Inventory adjustment not found.");

            await _adjustmentRepo.DeleteAsync(adjustment);
        }
    }
}