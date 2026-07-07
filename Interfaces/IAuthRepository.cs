using JelycoWarehouse.DTOs.Auth;

namespace JelycoWarehouse.Interfaces
{
    public interface IAuthRepository
    {
        Task<string?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<AuthResponseDto?> RefreshAsync(string refreshToken);
        Task<bool> LogoutAsync(string userId);
    }
}