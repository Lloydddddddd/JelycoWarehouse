using JelycoWarehouse.DTOs.WarehouseReleases;
using JelycoWarehouse.Enums;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class WarehouseReleaseService
    {
        private readonly IWarehouseReleaseRepository _releaseRepo;
        private readonly TransactionService _transactionService;

        public WarehouseReleaseService(
            IWarehouseReleaseRepository releaseRepo,
            TransactionService transactionService)
        {
            _releaseRepo = releaseRepo;
            _transactionService = transactionService;
        }

        public async Task<IEnumerable<WarehouseReleaseDto>> GetAllAsync()
        {
            var releases = await _releaseRepo.GetAllAsync();

            return releases.Select(r => new WarehouseReleaseDto
            {
                Id = r.Id,
                ReleaseReference = r.ReleaseReference,
                ReleaseDate = r.ReleaseDate,
                Destination = r.Destination,
                GrandTotal = r.GrandTotal,

                Items = r.Items.Select(i => new WarehouseReleaseItemDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.Item?.Name ?? string.Empty,
                    Quantity = i.Quantity,
                    UnitCost = i.UnitCost,
                    TotalCost = i.TotalCost
                }).ToList()
            });
        }

        public async Task<WarehouseReleaseDto?> GetByIdAsync(int id)
        {
            var release = await _releaseRepo.GetByIdAsync(id);

            if (release == null)
                return null;

            return new WarehouseReleaseDto
            {
                Id = release.Id,
                ReleaseReference = release.ReleaseReference,
                ReleaseDate = release.ReleaseDate,
                Destination = release.Destination,
                GrandTotal = release.GrandTotal,

                Items = release.Items.Select(i => new WarehouseReleaseItemDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.Item?.Name ?? string.Empty,
                    Quantity = i.Quantity,
                    UnitCost = i.UnitCost,
                    TotalCost = i.TotalCost
                }).ToList()
            };
        }

        public async Task<WarehouseReleaseDto> AddAsync(
            WarehouseReleaseCreateDto dto)
        {
            var release = new WarehouseRelease
            {
                ReleaseReference = await GenerateReleaseReferenceAsync(),
                ReleaseDate = dto.ReleaseDate,
                Destination = dto.Destination
            };

            foreach (var dtoItem in dto.Items)
            {
                var stock = await _transactionService
                    .GetCurrentStockAsync(dtoItem.ItemId);

                if (stock < dtoItem.Quantity)
                {
                    throw new Exception(
                        $"Not enough stock for Item ID {dtoItem.ItemId}.");
                }

                release.Items.Add(new WarehouseReleaseItem
                {
                    ItemId = dtoItem.ItemId,
                    Quantity = dtoItem.Quantity,
                    UnitCost = dtoItem.UnitCost,
                    TotalCost = dtoItem.Quantity * dtoItem.UnitCost
                });
            }

            release.GrandTotal =
                release.Items.Sum(i => i.TotalCost);

            await _releaseRepo.AddAsync(release);

            // Automatically create stock OUT transactions
            foreach (var item in release.Items)
            {
                await _transactionService.AddAsync(
                    new Transaction
                    {
                        ItemId = item.ItemId,
                        WarehouseReleaseId = release.Id,
                        Quantity = item.Quantity,
                        Type = TransactionType.OUT,
                        Date = release.ReleaseDate
                    });
            }

            return new WarehouseReleaseDto
            {
                Id = release.Id,
                ReleaseReference = release.ReleaseReference,
                ReleaseDate = release.ReleaseDate,
                Destination = release.Destination,
                GrandTotal = release.GrandTotal,

                Items = release.Items.Select(i => new WarehouseReleaseItemDto
                {
                    ItemId = i.ItemId,
                    ItemName = i.Item?.Name ?? string.Empty,
                    Quantity = i.Quantity,
                    UnitCost = i.UnitCost,
                    TotalCost = i.TotalCost
                }).ToList()
            };
        }

        private async Task<string> GenerateReleaseReferenceAsync()
        {
            var releases = await _releaseRepo.GetAllAsync();

            if (!releases.Any())
                return "WR-0001";

            var maxNumber = releases
                .Select(r =>
                {
                    var numberPart = r.ReleaseReference
                        .Replace("WR-", "");

                    return int.TryParse(numberPart, out var number)
                        ? number
                        : 0;
                })
                .Max();

            return $"WR-{(maxNumber + 1):D4}";
        }
    }
}