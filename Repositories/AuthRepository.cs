using JelycoWarehouse.DTOs.Auth;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace JelycoWarehouse.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;

        public AuthRepository(
            UserManager<ApplicationUser> userManager,
            IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<string?> RegisterAsync(RegisterDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return null;
            }

            await _userManager.AddToRoleAsync(user, "User");

            return user.Id;
        }

        public async Task<LoginResultDto> LoginAsync(LoginDto dto)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(dto.Email);

                if (user == null)
                {
                    return new LoginResultDto
                    {
                        Success = false,
                        Message = "USER_NOT_FOUND"
                    };
                }

                if (!user.IsActive)
                {
                    return new LoginResultDto
                    {
                        Success = false,
                        Message = "USER_INACTIVE"
                    };
                }

                var validPassword =
                    await _userManager.CheckPasswordAsync(user, dto.Password);

                if (!validPassword)
                {
                    return new LoginResultDto
                    {
                        Success = false,
                        Message = "INVALID_PASSWORD"
                    };
                }

                var roles = await _userManager.GetRolesAsync(user);

                var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? ""),
                new Claim("uid", user.Id)
            };

                claims.AddRange(
                    roles.Select(r => new Claim(ClaimTypes.Role, r)));

                var jwtKey = _config["Jwt:Key"]!;

                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey));

                var creds = new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _config["Jwt:Issuer"],
                    audience: _config["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(2),
                    signingCredentials: creds);

                var refreshToken = Guid.NewGuid().ToString();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

                var updateResult = await _userManager.UpdateAsync(user);

                if (!updateResult.Succeeded)
                {
                    return new LoginResultDto
                    {
                        Success = false,
                        Message = string.Join(", ",
                            updateResult.Errors.Select(e => e.Description))
                    };
                }

                return new LoginResultDto
                {
                    Success = true,
                    Tokens = new AuthResponseDto
                    {
                        Token = new JwtSecurityTokenHandler()
                            .WriteToken(token),
                        RefreshToken = refreshToken
                    }
                };
            }
            catch (Exception ex)
            {
                return new LoginResultDto
                {
                    Success = false,
                    Message = ex.ToString()
                };
            }
        }

        public async Task<AuthResponseDto?> RefreshAsync(string refreshToken)
        {
            var user = _userManager.Users.FirstOrDefault(
                u => u.RefreshToken == refreshToken);

            if (user == null)
            {
                return null;
            }

            if (!user.IsActive)
            {
                return null;
            }

            if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? string.Empty),
                new Claim("uid", user.Id ?? string.Empty)
            };

            claims.AddRange(
                roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var jwtKey = _config["Jwt:Key"]!;

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey));

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);

            var newToken = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            user.RefreshToken = Guid.NewGuid().ToString();
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userManager.UpdateAsync(user);

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler()
                    .WriteToken(newToken),

                RefreshToken = user.RefreshToken
            };
        }

        public async Task<bool> LogoutAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;

            await _userManager.UpdateAsync(user);

            return true;
        }
    }
}