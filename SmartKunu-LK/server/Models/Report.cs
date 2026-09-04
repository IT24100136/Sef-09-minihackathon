namespace SmartKunu.Server.Models;

public class Report
{
    public int Id { get; set; }
    public string ReporterName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string WasteCategory { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}