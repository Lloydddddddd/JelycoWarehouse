using JelycoWarehouse.DTOs.Items;
using JelycoWarehouse.DTOs.Suppliers;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly SupplierService _supplierService;

        public SuppliersController(SupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        // GET: api/suppliers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDto>>> GetSuppliers()
        {
            var suppliers = await _supplierService.GetAllAsync();
            var dtos = suppliers.Select(s => new SupplierDto
            {
                Id = s.Id,
                Name = s.Name,
                ContactInfo = s.ContactInfo,
                Address = s.Address,
                Email = s.Email,
                IsActive = s.IsActive,
                Items = s.Items!.Select(i => new ItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Category = i.Category,
                    Quantity = i.Quantity,
                    CostPrice = i.CostPrice,
                    IsActive = i.IsActive
                }).ToList()
            });
            return Ok(dtos);
        }

        // GET: api/suppliers/count
        [HttpGet("count")]
        [Produces("application/json")]
        public async Task<ActionResult<int>> GetSupplierCount()
        {
            return Ok(await _supplierService.CountActiveAsync());
        }

        // GET: api/suppliers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SupplierDto>> GetSupplier(int id)
        {
            var supplier = await _supplierService.GetByIdAsync(id);
            if (supplier == null) return NotFound();

            var dto = new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactInfo = supplier.ContactInfo,
                Address = supplier.Address,
                Email = supplier.Email,
                IsActive = supplier.IsActive,
                Items = supplier.Items!.Select(i => new ItemDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Category = i.Category,
                    Quantity = i.Quantity,
                    CostPrice = i.CostPrice,
                    IsActive = i.IsActive
                }).ToList()
            };
            return Ok(dto);
        }

        // POST: api/suppliers
        [HttpPost]
        public async Task<ActionResult<SupplierDto>> PostSupplier(SupplierCreateDto dto)
        {
            var supplier = new Supplier
            {
                Name = dto.Name,
                ContactInfo = dto.ContactInfo,
                Address = dto.Address,
                Email = dto.Email
            };

            await _supplierService.AddAsync(supplier);

            var supplierDto = new SupplierDto
            {
                Id = supplier.Id,
                Name = supplier.Name,
                ContactInfo = supplier.ContactInfo,
                Address = supplier.Address,
                Email = supplier.Email,
                Items = new List<ItemDto>()
            };

            return CreatedAtAction(nameof(GetSupplier), new { id = supplier.Id }, supplierDto);
        }

        // PUT: api/suppliers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSupplier(int id, SupplierUpdateDto dto)
        {
            var supplier = await _supplierService.GetByIdAsync(id);
            if (supplier == null) return NotFound();

            supplier.Name = dto.Name;
            supplier.ContactInfo = dto.ContactInfo;
            supplier.Address = dto.Address;
            supplier.Email = dto.Email;

            await _supplierService.UpdateAsync(supplier);
            return NoContent();
        }

        // DELETE: api/suppliers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            var supplier = await _supplierService.GetByIdAsync(id);
            if (supplier == null) return NotFound();

            await _supplierService.DeactivateAsync(id); //soft delete
            return NoContent();
        }
    }
}