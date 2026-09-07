using JelycoWarehouse.DTOs.SupplierDeliveries;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(
        AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
        Roles = "Admin,Manager,Staff,Viewer"
    )]
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierDeliveriesController : ControllerBase
    {
        private readonly SupplierDeliveryService _deliveryService;

        public SupplierDeliveriesController(
            SupplierDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;
        }

        // GET: api/supplierdeliveries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDeliveryDto>>> GetDeliveries()
        {
            var deliveries = await _deliveryService.GetAllAsync();
            return Ok(deliveries);
        }

        // GET: api/supplierdeliveries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDeliveryDto>> GetDelivery(int id)
        {
            var delivery = await _deliveryService.GetByIdAsync(id);

            if (delivery == null)
                return NotFound();

            return Ok(delivery);
        }

        // POST: api/supplierdeliveries
        [Authorize(
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
            Roles = "Admin,Manager,Staff"
        )]
        [HttpPost]
        public async Task<ActionResult<SupplierDeliveryDto>> PostDelivery(
            SupplierDeliveryCreateDto dto)
        {
            var delivery = await _deliveryService.AddAsync(dto);

            return CreatedAtAction(
                nameof(GetDelivery),
                new { id = delivery.Id },
                delivery);
        }

        // DELETE: api/supplierdeliveries/5
        [Authorize(
            AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
            Roles = "Admin,Manager"
        )]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDelivery(int id)
        {
            await _deliveryService.DeleteAsync(id);

            return NoContent();
        }
    }
}