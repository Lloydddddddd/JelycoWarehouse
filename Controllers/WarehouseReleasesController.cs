using JelycoWarehouse.DTOs.WarehouseReleases;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseReleasesController : ControllerBase
    {
        private readonly WarehouseReleaseService _releaseService;

        public WarehouseReleasesController(
            WarehouseReleaseService releaseService)
        {
            _releaseService = releaseService;
        }

        // GET: api/warehousereleases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WarehouseReleaseDto>>> GetReleases()
        {
            var releases = await _releaseService.GetAllAsync();
            return Ok(releases);
        }

        // GET: api/warehousereleases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WarehouseReleaseDto>> GetRelease(int id)
        {
            var release = await _releaseService.GetByIdAsync(id);

            if (release == null)
                return NotFound();

            return Ok(release);
        }

        // POST: api/warehousereleases
        [HttpPost]
        public async Task<ActionResult<WarehouseReleaseDto>> PostRelease(
            WarehouseReleaseCreateDto dto)
        {
            var release = await _releaseService.AddAsync(dto);

            return CreatedAtAction(
                nameof(GetRelease),
                new { id = release.Id },
                release);
        }

        // DELETE: api/warehousereleases/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRelease(int id)
        {
            await _releaseService.DeleteAsync(id);

            return NoContent();
        }
    }
}