namespace JelycoWarehouse.DTOs.Auth
{
    public class LoginResultDto
    {
        public bool Success { get; set; }

        public string? Message { get; set; }

        public AuthResponseDto? Tokens { get; set; }
    }
}