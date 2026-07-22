using JelycoWarehouse.DTOs.Items;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/items")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly ItemService _itemService;

        public ItemsController(ItemService itemService)
        {
            _itemService = itemService;
        }

        // GET: api/items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            return Ok(await _itemService.GetAllAsync());
        }

        // GET: api/items/count
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetItemCount()
        {
            return Ok(await _itemService.CountActiveAsync());
        }

        // GET: api/items/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var item = await _itemService.GetByIdAsync(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // POST: api/items
        [HttpPost]
        public async Task<ActionResult<ItemDto>> PostItem(ItemCreateDto dto)
        {
            var item = new Item
            {
                Name = dto.Name,
                BrandId = dto.BrandId,
                Kind = dto.Kind,
                Size = dto.Size,
                Color = dto.Color,
                Category = dto.Category,

                // Stock starts at zero.
                // It will only change through Supplier Deliveries
                // and Warehouse Releases.
                Quantity = 0,

                // NEW
                ReorderLevel = dto.ReorderLevel,

                CostPrice = dto.CostPrice,
                ExpiryDate = dto.ExpiryDate,
                IsActive = true
            };

            await _itemService.AddAsync(item);

            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                BrandId = item.BrandId,
                Brand = item.Brand?.Name ?? string.Empty,
                Kind = item.Kind,
                Size = item.Size,
                Color = item.Color,
                Category = item.Category,
                Quantity = item.Quantity,
                ReorderLevel = item.ReorderLevel,
                CostPrice = item.CostPrice,
                ExpiryDate = item.ExpiryDate,
                IsActive = item.IsActive
            });
        }

        // PUT: api/items/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, ItemUpdateDto dto)
        {
            var item = await _itemService.GetEntityByIdAsync(id);

            if (item == null)
                return NotFound();

            item.Name = dto.Name;
            item.BrandId = dto.BrandId;
            item.Kind = dto.Kind;
            item.Size = dto.Size;
            item.Color = dto.Color;
            item.Category = dto.Category;
            item.ReorderLevel = dto.ReorderLevel;
            item.CostPrice = dto.CostPrice;
            item.ExpiryDate = dto.ExpiryDate;

            await _itemService.UpdateAsync(item);

            return NoContent();
        }

        // DELETE: api/items/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _itemService.GetEntityByIdAsync(id);

            if (item == null)
                return NotFound();

            await _itemService.DeactivateAsync(id);

            return NoContent();
        }
    }
}