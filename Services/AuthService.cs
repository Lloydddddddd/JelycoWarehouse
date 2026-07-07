using JelycoWarehouse.DTOs.Auth;
using JelycoWarehouse.Interfaces;

namespace JelycoWarehouse.Services
{
    public class AuthService
    {
        private readonly IAuthRepository _authRepository;

        public AuthService(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public Task<string?> RegisterAsync(RegisterDto dto) => _authRepository.RegisterAsync(dto);
        public Task<AuthResponseDto?> LoginAsync(LoginDto dto) => _authRepository.LoginAsync(dto);
        public Task<AuthResponseDto?> RefreshAsync(string refreshToken) => _authRepository.RefreshAsync(refreshToken);
        public Task<bool> LogoutAsync(string userId) => _authRepository.LogoutAsync(userId);
    }
}