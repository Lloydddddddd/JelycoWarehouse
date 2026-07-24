using JelycoWarehouse.DTOs.Reports;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class WarehouseReleaseReportService
    {
        private readonly WarehouseContext _context;

        public WarehouseReleaseReportService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<WarehouseReleaseReportDto>> GetWarehouseReleaseReportAsync()
        {
            return await _context.WarehouseReleases
                .AsNoTracking()
                .Include(r => r.Items)
                .OrderByDescending(r => r.ReleaseDate)
                .Select(r => new WarehouseReleaseReportDto
                {
                    ReleaseId = r.Id,
                    ReleaseReference = r.ReleaseReference,
                    ReleaseDate = r.ReleaseDate,
                    Destination = r.Destination,

                    // Sum of all quantities released
                    TotalQuantity = r.Items.Sum(i => i.Quantity),

                    GrandTotal = r.GrandTotal
                })
                .ToListAsync();
        }
    }
}