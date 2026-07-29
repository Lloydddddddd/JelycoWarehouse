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
    }
}