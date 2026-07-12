using JelycoWarehouse.Interfaces;
using JelycoWarehouse.Models;

namespace JelycoWarehouse.Services
{
    public class LocationService
    {
        private readonly ILocationRepository _locationRepository;

        public LocationService(
            ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        public async Task<IEnumerable<Location>> GetAllAsync()
        {
            return await _locationRepository.GetAllAsync();
        }

        public async Task<Location?> GetByIdAsync(int id)
        {
            return await _locationRepository.GetByIdAsync(id);
        }
    }
}