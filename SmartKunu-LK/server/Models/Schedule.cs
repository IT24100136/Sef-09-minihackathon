namespace SmartKunu.Server.Models;

public class Schedule
{
    public int Id { get; set; }
    public string Municipality { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string WasteCategory { get; set; } = string.Empty;
    public string PickupDates { get; set; } = string.Empty;
    public string RouteInfo { get; set; } = string.Empty;
    public string Guidelines { get; set; } = string.Empty;
}