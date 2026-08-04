using JelycoWarehouse.DTOs.Users;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.AspNetCore.Identity;

namespace JelycoWarehouse.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UserRepository(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserDto?> GetCurrentUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName ?? "",
                Email = user.Email ?? "",
                Role = roles.FirstOrDefault() ?? ""
            };
        }

        public async Task<UserDto?> UpdateProfileAsync(
            string userId,
            string fullName)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return null;

            user.FullName = fullName;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName ?? "",
                Email = user.Email ?? "",
                Role = roles.FirstOrDefault() ?? ""
            };
        }

        public async Task<bool> ChangePasswordAsync(
            string userId,
            string currentPassword,
            string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return false;

            var result = await _userManager.ChangePasswordAsync(
                user,
                currentPassword,
                newPassword);

            return result.Succeeded;
        }
    }
}