using JelycoWarehouse.DTOs.Brands;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(
        AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,
        Roles = "Admin,Manager")]
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly BrandService _brandService;

        public BrandsController(BrandService brandService)
        {
            _brandService = brandService;
        }

        // GET: api/brands
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandDto>>> GetBrands()
        {
            var brands = await _brandService.GetAllAsync();
            return Ok(brands);
        }

        // GET: api/brands/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDto>> GetBrand(int id)
        {
            var brand = await _brandService.GetByIdAsync(id);

            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

        // POST: api/brands
        [HttpPost]
        public async Task<ActionResult<BrandDto>> CreateBrand(
            BrandCreateDto dto)
        {
            var brand = await _brandService.AddAsync(dto);

            return CreatedAtAction(
                nameof(GetBrand),
                new { id = brand.Id },
                brand);
        }

        // PUT: api/brands/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(
            int id,
            BrandUpdateDto dto)
        {
            await _brandService.UpdateAsync(id, dto);

            return NoContent();
        }

        // DELETE: api/brands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            await _brandService.DeleteAsync(id);

            return NoContent();
        }
    }
}