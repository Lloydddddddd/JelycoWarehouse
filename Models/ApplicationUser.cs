using Microsoft.AspNetCore.Identity;

namespace JelycoWarehouse.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }

        // Refresh token support
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}