using JelycoWarehouse.DTOs.Users;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace JelycoWarehouse.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst("uid")?.Value;

            if (userId == null)
                return Unauthorized();

            var user = await _userService.GetCurrentUserAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = User.FindFirst("uid")?.Value;

            if (userId == null)
                return Unauthorized();

            var user = await _userService.UpdateProfileAsync(
                userId,
                dto.FullName);

            if (user == null)
                return BadRequest();

            return Ok(user);
        }

        [HttpPut("me/password")]
        public async Task<IActionResult> ChangePassword(
            ChangePasswordDto dto)
        {
            var userId = User.FindFirst("uid")?.Value;

            if (userId == null)
                return Unauthorized();

            var success = await _userService.ChangePasswordAsync(
                userId,
                dto.CurrentPassword,
                dto.NewPassword);

            if (!success)
            {
                return BadRequest(new
                {
                    message = "Current password is incorrect."
                });
            }

            return Ok(new
            {
                message = "Password changed successfully."
            });
        }
    }
}