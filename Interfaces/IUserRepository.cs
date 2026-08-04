using JelycoWarehouse.DTOs.Users;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Interfaces
{
    public interface IUserRepository
    {
        Task<UserDto?> GetCurrentUserAsync(string userId);
        Task<UserDto?> UpdateProfileAsync(
            string userId,
            string fullName);
        Task<bool> ChangePasswordAsync(
            string userId,
            string currentPassword,
            string newPassword);
    }
}