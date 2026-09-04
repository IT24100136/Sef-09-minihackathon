namespace SmartKunu.Server.DTOs;

public record UpdateReportDto(
    string? ReporterName,
    string? MobileNumber,
    string? Ward,
    string? WasteCategory,
    string? Description,
    string? Status
);
