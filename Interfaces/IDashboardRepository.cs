using JelycoWarehouse.DTOs.Dashboard;

namespace JelycoWarehouse.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardDto> GetDashboardAsync();
    }
}