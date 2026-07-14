using JelycoWarehouse.DTOs.Dashboard;
using JelycoWarehouse.Interfaces;

namespace JelycoWarehouse.Services
{
    public class DashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardService(
            IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        public async Task<DashboardDto> GetDashboardAsync()
        {
            return await _dashboardRepository.GetDashboardAsync();
        }
    }
}