using JelycoWarehouse.DTOs.AdminUsers;
using JelycoWarehouse.DTOs.Common;
using JelycoWarehouse.Interfaces;

namespace JelycoWarehouse.Services
{
    public class AdminUserService
    {
        private readonly IAdminUserRepository _repository;

        public AdminUserService(IAdminUserRepository repository)
        {
            _repository = repository;
        }

        public Task<List<UserListDto>> GetAllUsersAsync()
        {
            return _repository.GetAllUsersAsync();
        }

        public Task<OperationResultDto> CreateUserAsync(CreateUserDto dto)
        {
            return _repository.CreateUserAsync(dto);
        }

        public Task<OperationResultDto> UpdateUserAsync(string id, UpdateUserDto dto)
        {
            return _repository.UpdateUserAsync(id, dto);
        }

        public Task<OperationResultDto> UpdateUserStatusAsync(string id, bool isActive)
        {
            return _repository.UpdateUserStatusAsync(id, isActive);
        }
    }
}