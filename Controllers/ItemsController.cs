using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JelycoWarehouse.Models;
using JelycoWarehouse.Services;
using JelycoWarehouse.DTOs.Items;

namespace JelycoWarehouse.Controllers
{
    [Route("api/items")]
    [ApiController]
    //[Authorize(AuthenticationSchemes = "Bearer")]
    public class ItemsController : ControllerBase
    {
        private readonly ItemService _itemService;

        public ItemsController(ItemService itemService)
        {
            _itemService = itemService;
        }

        // GET: api/items
        [HttpGet]
        [Produces("application/json")]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _itemService.GetAllAsync();

            var dtos = items.Select(i => new ItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Brand = i.Brand,
                Kind = i.Kind,
                Size = i.Size,
                Color = i.Color,
                Category = i.Category,
                Quantity = i.Quantity,
                CostPrice = i.CostPrice,
                ReorderLevel = i.ReorderLevel,
                ExpiryDate = i.ExpiryDate,
                SupplierId = i.SupplierId,
                SupplierName = i.Supplier?.Name ?? string.Empty,
                IsActive = i.IsActive
            });

            return Ok(dtos);
        }

        // GET: api/items/count
        [HttpGet("count")]
        [Produces("application/json")]
        public async Task<ActionResult<int>> GetItemCount()
        {
            var items = await _itemService.GetAllAsync();
            var count = items.Count(i => i.IsActive);

            return Ok(count);
        }

        // GET: api/items/{id}
        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var item = await _itemService.GetByIdAsync(id);

            if (item == null)
                return NotFound();

            var dto = new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Brand = item.Brand,
                Kind = item.Kind,
                Size = item.Size,
                Color = item.Color,
                Category = item.Category,
                Quantity = item.Quantity,
                CostPrice = item.CostPrice,
                ReorderLevel = item.ReorderLevel,
                ExpiryDate = item.ExpiryDate,
                SupplierId = item.SupplierId,
                SupplierName = item.Supplier?.Name ?? string.Empty,
                IsActive = item.IsActive
            };

            return Ok(dto);
        }

        // POST: api/items
        [HttpPost]
        //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Manager")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public async Task<ActionResult<ItemDto>> PostItem([FromBody] ItemCreateDto dto)
        {
            var item = new Item
            {
                Name = dto.Name,
                Brand = dto.Brand,
                Kind = dto.Kind,
                Size = dto.Size,
                Color = dto.Color,
                Category = dto.Category,
                Quantity = dto.Quantity,
                CostPrice = dto.CostPrice,
                ReorderLevel = dto.ReorderLevel,
                ExpiryDate = dto.ExpiryDate,
                SupplierId = dto.SupplierId
            };

            await _itemService.AddAsync(item);

            var itemDto = new ItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Brand = item.Brand,
                Kind = item.Kind,
                Size = item.Size,
                Color = item.Color,
                Category = item.Category,
                Quantity = item.Quantity,
                CostPrice = item.CostPrice,
                ReorderLevel = item.ReorderLevel,
                ExpiryDate = item.ExpiryDate,
                SupplierId = item.SupplierId,
                SupplierName = item.Supplier?.Name ?? string.Empty,
                IsActive = item.IsActive
            };

            return CreatedAtAction(nameof(GetItem), new { id = item.Id }, itemDto);
        }

        // PUT: api/items/{id}
        [HttpPut("{id}")]
        //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin,Manager")]
        [Consumes("application/json")]
        [Produces("application/json")]
        public async Task<IActionResult> PutItem(int id, [FromBody] ItemUpdateDto dto)
        {
            var item = await _itemService.GetByIdAsync(id);

            if (item == null)
                return NotFound();

            item.Name = dto.Name;
            item.Brand = dto.Brand;
            item.Kind = dto.Kind;
            item.Size = dto.Size;
            item.Color = dto.Color;
            item.Category = dto.Category;
            item.Quantity = dto.Quantity;
            item.CostPrice = dto.CostPrice;
            item.ReorderLevel = dto.ReorderLevel;
            item.ExpiryDate = dto.ExpiryDate;
            item.SupplierId = dto.SupplierId;

            await _itemService.UpdateAsync(item);

            return NoContent();
        }

        // DELETE: api/items/{id}
        [HttpDelete("{id}")]
        //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _itemService.GetByIdAsync(id);

            if (item == null)
                return NotFound();

            await _itemService.DeactivateAsync(id);

            return NoContent();
        }
    }
}