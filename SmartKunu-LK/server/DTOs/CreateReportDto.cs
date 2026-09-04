using System.ComponentModel.DataAnnotations;

namespace SmartKunu.Server.DTOs;

public record CreateReportDto(
    [Required]
    [MinLength(2)]
    string ReporterName,

    [Required]
    [RegularExpression(@"^(?:0|94)?7[0-9]{8}$", ErrorMessage = "Invalid Sri Lankan phone number")]
    string MobileNumber,

    [Required]
    [MinLength(2)]
    string Ward,

    [Required]
    string WasteCategory,

    [Required]
    [MinLength(10)]
    string Description
);