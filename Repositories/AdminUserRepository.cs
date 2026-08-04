using JelycoWarehouse.DTOs.AdminUsers;
using JelycoWarehouse.DTOs.Common;
using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;
using Microsoft.AspNetCore.Identity;

namespace JelycoWarehouse.Repositories
{
    public class AdminUserRepository : IAdminUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminUserRepository(
            UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<UserListDto>> GetAllUsersAsync()
        {
            var users = _userManager.Users.ToList();

            var result = new List<UserListDto>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new UserListDto
                {
                    Id = user.Id,
                    FullName = user.FullName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? string.Empty,
                    IsActive = user.IsActive
                });
            }

            return result
                .OrderBy(u => u.FullName)
                .ToList();
        }

        public async Task<OperationResultDto> CreateUserAsync(CreateUserDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = "Email address already exists."
                };
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                IsActive = true
            };

            var createResult = await _userManager.CreateAsync(user, dto.Password);

            if (!createResult.Succeeded)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = string.Join(", ", createResult.Errors.Select(e => e.Description))
                };
            }

            var roleResult = await _userManager.AddToRoleAsync(user, dto.Role);

            if (!roleResult.Succeeded)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = string.Join(", ", roleResult.Errors.Select(e => e.Description))
                };
            }

            return new OperationResultDto
            {
                Success = true,
                Message = "User created successfully."
            };
        }

        public async Task<OperationResultDto> UpdateUserAsync(string id, UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);

            if (existingUser != null && existingUser.Id != id)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = "Email address already exists."
                };
            }

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.UserName = dto.Email;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = string.Join(", ", updateResult.Errors.Select(e => e.Description))
                };
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            if (currentRoles.Any())
            {
                var removeRolesResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);

                if (!removeRolesResult.Succeeded)
                {
                    return new OperationResultDto
                    {
                        Success = false,
                        Message = string.Join(", ", removeRolesResult.Errors.Select(e => e.Description))
                    };
                }
            }

            var addRoleResult = await _userManager.AddToRoleAsync(user, dto.Role);

            if (!addRoleResult.Succeeded)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = string.Join(", ", addRoleResult.Errors.Select(e => e.Description))
                };
            }

            return new OperationResultDto
            {
                Success = true,
                Message = "User updated successfully."
            };
        }

        public async Task<OperationResultDto> UpdateUserStatusAsync(string id, bool isActive)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            user.IsActive = isActive;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return new OperationResultDto
                {
                    Success = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                };
            }

            return new OperationResultDto
            {
                Success = true,
                Message = isActive
                    ? "User activated successfully."
                    : "User deactivated successfully."
            };
        }
    }
}