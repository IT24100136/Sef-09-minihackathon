using System.ComponentModel.DataAnnotations;

namespace SmartKunu.Server.DTOs;

public record CreateScheduleDto(
    [Required] string Municipality,
    [Required] string Ward,
    [Required] string WasteCategory,
    [Required] string PickupDates,
    [Required] string RouteInfo,
    [Required] string Guidelines
);

public record UpdateScheduleDto(
    string? Municipality,
    string? Ward,
    string? WasteCategory,
    string? PickupDates,
    string? RouteInfo,
    string? Guidelines
);
