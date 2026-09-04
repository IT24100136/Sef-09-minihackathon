using Microsoft.EntityFrameworkCore;
using SmartKunu.Server.Data;
using SmartKunu.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("SmartKunuDb"));

// Configure CORS for local frontend requests
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseCors("AllowLocalFrontend");

// Health check endpoint
app.MapGet("/", () => Results.Ok(new { status = "Online", service = "SmartKunu-LK Web API", version = "1.0.0" }));

// GET /api/reports - Fetch all complaints/reports
app.MapGet("/api/reports", async (AppDbContext db) =>
{
    var reports = await db.Reports.OrderByDescending(r => r.CreatedAt).ToListAsync();
    return Results.Ok(reports);
});

// POST /api/reports - Create a new complaint report
app.MapPost("/api/reports", async (CreateReportDto dto, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dto.ReporterName) ||
        string.IsNullOrWhiteSpace(dto.MobileNumber) ||
        string.IsNullOrWhiteSpace(dto.WardName) ||
        string.IsNullOrWhiteSpace(dto.HazardCategory) ||
        string.IsNullOrWhiteSpace(dto.Description))
    {
        return Results.BadRequest(new { message = "All report fields are required." });
    }

    var report = new Report
    {
        ReporterName = dto.ReporterName,
        MobileNumber = dto.MobileNumber,
        WardName = dto.WardName,
        HazardCategory = dto.HazardCategory,
        Description = dto.Description,
        CreatedAt = DateTime.UtcNow
    };

    db.Reports.Add(report);
    await db.SaveChangesAsync();

    return Results.Created($"/api/reports/{report.Id}", report);
});

app.Run();
