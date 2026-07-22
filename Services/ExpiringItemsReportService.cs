using JelycoWarehouse.DTOs.Reports;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class ExpiringItemsReportService
    {
        private readonly WarehouseContext _context;

        public ExpiringItemsReportService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<ExpiringItemsReportDto>> GetExpiringItemsReportAsync()
        {
            var today = DateTime.Today;
            var next30Days = today.AddDays(30);

            return await _context.Items
                .Include(i => i.Brand)
                .Where(i => i.ExpiryDate.HasValue &&
                            i.ExpiryDate.Value <= next30Days)
                .OrderBy(i => i.ExpiryDate)
                .Select(i => new ExpiringItemsReportDto
                {
                    ItemId = i.Id,
                    ItemName = i.Name,
                    Brand = i.Brand != null ? i.Brand.Name : string.Empty,
                    Category = i.Category,

                    ExpiryDate = i.ExpiryDate!.Value,

                    DaysRemaining =
                        EF.Functions.DateDiffDay(today, i.ExpiryDate!.Value),

                    Status = i.ExpiryDate < today
                        ? "Expired"
                        : "Expiring Soon"
                })
                .ToListAsync();
        }
    }
}