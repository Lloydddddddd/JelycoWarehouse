using JelycoWarehouse.DTOs.Auth;
using JelycoWarehouse.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JelycoWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var userId = await _authService.RegisterAsync(dto);
            if (userId == null) return BadRequest(new { error = "Registration failed" });
            return Ok(new { userId });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (result == null) return Unauthorized(new { error = "Invalid credentials" });
            return Ok(result);
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> Refresh([FromBody] RefreshDto dto)
        {
            var result = await _authService.RefreshAsync(dto.RefreshToken);
            if (result == null) return Unauthorized(new { error = "Invalid or expired refresh token" });
            return Ok(result);
        }

        [HttpPost("logout")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst("uid")?.Value;
            if (userId == null) return Unauthorized();

            var success = await _authService.LogoutAsync(userId);
            if (!success) return Unauthorized(new { error = "Logout failed" });

            return Ok(new { message = "Logged out successfully" });
        }
    }
}