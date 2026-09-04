using Microsoft.EntityFrameworkCore;
using SmartKunu.Server.Data;
using SmartKunu.Server.DTOs;
using SmartKunu.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure CORS: Add a policy named "AllowFrontend" for local React integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Register AppDbContext with PostgreSQL (Neon Database)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-create database & apply seed data on startup if not existing
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Enable Swagger UI and CORS
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

// Health check endpoint
app.MapGet("/", () => Results.Ok(new { status = "Online", service = "SmartKunu-LK Web API", database = "PostgreSQL (Neon)" }));

// Endpoint 1: GET /api/schedules - Fetch schedules from PostgreSQL database
app.MapGet("/api/schedules", async (AppDbContext db) =>
{
    var schedules = await db.Schedules.ToListAsync();
    return Results.Ok(schedules);
})
.WithName("GetSchedules");

// Endpoint 2: GET /api/reports - Fetch reports from PostgreSQL database
app.MapGet("/api/reports", async (AppDbContext db) =>
{
    var reports = await db.Reports.OrderByDescending(r => r.CreatedAt).ToListAsync();
    return Results.Ok(reports);
})
.WithName("GetReports");

// Endpoint 3: POST /api/reports - Save incoming DTO to PostgreSQL database
app.MapPost("/api/reports", async (CreateReportDto dto, AppDbContext db) =>
{
    var newReport = new Report
    {
        Id = Random.Shared.Next(1, 10000),
        ReporterName = dto.ReporterName,
        MobileNumber = dto.MobileNumber,
        Ward = dto.Ward,
        WasteCategory = dto.WasteCategory,
        Description = dto.Description,
        CreatedAt = DateTime.UtcNow
    };

    db.Reports.Add(newReport);
    await db.SaveChangesAsync();

    return Results.Created($"/api/reports/{newReport.Id}", newReport);
})
.WithName("CreateReport");

app.Run();