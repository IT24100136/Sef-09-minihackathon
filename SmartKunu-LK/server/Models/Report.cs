namespace SmartKunu.Server.Models;

public class Report
{
    public int Id { get; set; }
    public string ReporterName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string WardName { get; set; } = string.Empty;
    public string HazardCategory { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public record CreateReportDto(
    string ReporterName,
    string MobileNumber,
    string WardName,
    string HazardCategory,
    string Description
);
