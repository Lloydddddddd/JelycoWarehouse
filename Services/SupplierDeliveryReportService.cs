using JelycoWarehouse.DTOs.Reports;
using JelycoWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace JelycoWarehouse.Services
{
    public class SupplierDeliveryReportService
    {
        private readonly WarehouseContext _context;

        public SupplierDeliveryReportService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<SupplierDeliveryReportDto>> GetSupplierDeliveryReportAsync()
        {
            return await _context.SupplierDeliveries
                .Include(d => d.Supplier)
                .Include(d => d.Items)
                .OrderByDescending(d => d.DeliveryDate)
                .Select(d => new SupplierDeliveryReportDto
                {
                    DeliveryId = d.Id,
                    DeliveryReference = d.DeliveryReference,
                    SupplierName = d.Supplier != null
                        ? d.Supplier.Name
                        : string.Empty,
                    DeliveryDate = d.DeliveryDate,

                    // Sum of all quantities received
                    TotalQuantity = d.Items.Sum(i => i.Quantity),

                    GrandTotal = d.GrandTotal
                })
                .ToListAsync();
        }
    }
}