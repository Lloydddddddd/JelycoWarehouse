using JelycoWarehouse.DTOs.InventoryAdjustments;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryAdjustmentsController : ControllerBase
    {
        private readonly InventoryAdjustmentService _adjustmentService;

        public InventoryAdjustmentsController(
            InventoryAdjustmentService adjustmentService)
        {
            _adjustmentService = adjustmentService;
        }

        // GET: api/InventoryAdjustments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryAdjustmentDto>>> GetAdjustments()
        {
            var adjustments = await _adjustmentService.GetAllAsync();
            return Ok(adjustments);
        }

        // GET: api/InventoryAdjustments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryAdjustmentDto>> GetAdjustment(int id)
        {
            var adjustment = await _adjustmentService.GetByIdAsync(id);

            if (adjustment == null)
                return NotFound();

            return Ok(adjustment);
        }

        // POST: api/InventoryAdjustments
        [HttpPost]
        public async Task<ActionResult<InventoryAdjustmentDto>> PostAdjustment(
            InventoryAdjustmentCreateDto dto)
        {
            var adjustment = await _adjustmentService.AddAsync(dto);

            return CreatedAtAction(
                nameof(GetAdjustment),
                new { id = adjustment.Id },
                adjustment);
        }

        // DELETE: api/InventoryAdjustments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdjustment(int id)
        {
            await _adjustmentService.DeleteAsync(id);

            return NoContent();
        }
    }
}