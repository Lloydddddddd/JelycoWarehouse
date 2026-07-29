using JelycoWarehouse.DTOs.Users;
using JelycoWarehouse.Interfaces;

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
    }
}