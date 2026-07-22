using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(
        AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
        Roles = "Admin,Manager")]
    [Route("api/reports")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly InventoryReportService _inventoryReportService;
        private readonly TransactionReportService _transactionReportService;
        private readonly LowStockReportService _lowStockReportService;
        private readonly ExpiringItemsReportService _expiringItemsReportService;
        private readonly SupplierDeliveryReportService _supplierDeliveryReportService;
        private readonly WarehouseReleaseReportService _warehouseReleaseReportService;

        public ReportsController(
            InventoryReportService inventoryReportService,
            TransactionReportService transactionReportService,
            LowStockReportService lowStockReportService,
            ExpiringItemsReportService expiringItemsReportService,
            SupplierDeliveryReportService supplierDeliveryReportService,
            WarehouseReleaseReportService warehouseReleaseReportService)
        {
            _inventoryReportService = inventoryReportService;
            _transactionReportService = transactionReportService;
            _lowStockReportService = lowStockReportService;
            _expiringItemsReportService = expiringItemsReportService;
            _supplierDeliveryReportService = supplierDeliveryReportService;
            _warehouseReleaseReportService = warehouseReleaseReportService;
        }

        // GET: api/reports/inventory
        [HttpGet("inventory")]
        public async Task<IActionResult> GetInventoryReport()
        {
            return Ok(await _inventoryReportService.GetInventoryReportAsync());
        }

        // GET: api/reports/transactions
        [HttpGet("transactions")]
        public async Task<IActionResult> GetTransactionReport()
        {
            return Ok(await _transactionReportService.GetTransactionReportAsync());
        }

        // GET: api/reports/low-stock
        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStockReport()
        {
            return Ok(await _lowStockReportService.GetLowStockReportAsync());
        }

        // GET: api/reports/expiring-items
        [HttpGet("expiring-items")]
        public async Task<IActionResult> GetExpiringItemsReport()
        {
            return Ok(await _expiringItemsReportService.GetExpiringItemsReportAsync());
        }

        // GET: api/reports/supplier-deliveries
        [HttpGet("supplier-deliveries")]
        public async Task<IActionResult> GetSupplierDeliveryReport()
        {
            return Ok(await _supplierDeliveryReportService.GetSupplierDeliveryReportAsync());
        }

        // GET: api/reports/warehouse-releases
        [HttpGet("warehouse-releases")]
        public async Task<IActionResult> GetWarehouseReleaseReport()
        {
            return Ok(await _warehouseReleaseReportService.GetWarehouseReleaseReportAsync());
        }
    }
}