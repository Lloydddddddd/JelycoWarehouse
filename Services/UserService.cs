using JelycoWarehouse.DTOs.Users;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Repositories;
using Microsoft.AspNetCore.Identity;

namespace JelycoWarehouse.Services
{
    public class UserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public Task<UserDto?> GetCurrentUserAsync(string userId)
        {
            return _repository.GetCurrentUserAsync(userId);
        }

        public Task<UserDto?> UpdateProfileAsync(
            string userId,
            string fullName)
        {
            return _repository.UpdateProfileAsync(userId, fullName);
        }

        public async Task<bool> ChangePasswordAsync(
            string userId,
            string currentPassword,
            string newPassword)
        {
            return await _repository.ChangePasswordAsync(
                userId,
                currentPassword,
                newPassword);
        }
    }
}