namespace JelycoWarehouse.Models.Common
{
    public class ApiErrorResponse
    {
        public bool Success { get; set; } = false;

        public int Status { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}