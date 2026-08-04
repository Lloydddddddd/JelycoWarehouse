using JelycoWarehouse.DTOs.AdminUsers;
using JelycoWarehouse.DTOs.Common;

namespace JelycoWarehouse.Interfaces
{
    public interface IAdminUserRepository
    {
        Task<List<UserListDto>> GetAllUsersAsync();

        Task<OperationResultDto> CreateUserAsync(CreateUserDto dto);

        Task<OperationResultDto> UpdateUserAsync(string id, UpdateUserDto dto);

        Task<OperationResultDto> UpdateUserStatusAsync(string id, bool isActive);

    }
}