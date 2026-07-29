using JelycoWarehouse.DTOs.Users;

namespace JelycoWarehouse.Interfaces
{
    public interface IUserRepository
    {
        Task<UserDto?> GetCurrentUserAsync(string userId);
    }
}