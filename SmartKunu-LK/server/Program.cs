using Microsoft.EntityFrameworkCore;
using SmartKunu.Server.Data;
using SmartKunu.Server.DTOs;
using SmartKunu.Server.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure dynamic PORT binding for Render / Cloud hosting
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://*:{port}");

// Configure CORS: Add a policy named "AllowFrontend" for local & production deployment
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

// Auto-create database, apply missing columns & seed data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    // Migration safety check
    try
    {
        db.Database.ExecuteSqlRaw(@"
            ALTER TABLE ""Reports"" ADD COLUMN IF NOT EXISTS ""Status"" text NOT NULL DEFAULT 'Pending';
        ");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration column check notice: {ex.Message}");
    }
}

// Enable Swagger UI across all environments for hackathon review
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartKunu LK Web API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");

// Health check endpoint
app.MapGet("/", () => Results.Ok(new { status = "Online", service = "SmartKunu-LK Web API", database = "PostgreSQL (Neon)" }));

#region Schedules Endpoints

// GET /api/schedules - Fetch all schedules from PostgreSQL database
app.MapGet("/api/schedules", async (AppDbContext db) =>
{
    var schedules = await db.Schedules.OrderBy(s => s.Municipality).ThenBy(s => s.Ward).ToListAsync();
    return Results.Ok(schedules);
})
.WithName("GetSchedules");

// POST /api/schedules - Create a new schedule (Admin)
app.MapPost("/api/schedules", async (CreateScheduleDto dto, AppDbContext db) =>
{
    var schedule = new Schedule
    {
        Municipality = dto.Municipality,
        Ward = dto.Ward,
        WasteCategory = dto.WasteCategory,
        PickupDates = dto.PickupDates,
        RouteInfo = dto.RouteInfo,
        Guidelines = dto.Guidelines
    };

    db.Schedules.Add(schedule);
    await db.SaveChangesAsync();

    return Results.Created($"/api/schedules/{schedule.Id}", schedule);
})
.WithName("CreateSchedule");

// PUT /api/schedules/{id} - Update schedule (Admin)
app.MapPut("/api/schedules/{id:int}", async (int id, UpdateScheduleDto dto, AppDbContext db) =>
{
    var schedule = await db.Schedules.FindAsync(id);
    if (schedule == null)
    {
        return Results.NotFound(new { message = $"Schedule with ID {id} not found." });
    }

    if (!string.IsNullOrWhiteSpace(dto.Municipality)) schedule.Municipality = dto.Municipality;
    if (!string.IsNullOrWhiteSpace(dto.Ward)) schedule.Ward = dto.Ward;
    if (!string.IsNullOrWhiteSpace(dto.WasteCategory)) schedule.WasteCategory = dto.WasteCategory;
    if (!string.IsNullOrWhiteSpace(dto.PickupDates)) schedule.PickupDates = dto.PickupDates;
    if (!string.IsNullOrWhiteSpace(dto.RouteInfo)) schedule.RouteInfo = dto.RouteInfo;
    if (!string.IsNullOrWhiteSpace(dto.Guidelines)) schedule.Guidelines = dto.Guidelines;

    await db.SaveChangesAsync();
    return Results.Ok(schedule);
})
.WithName("UpdateSchedule");

// DELETE /api/schedules/{id} - Delete schedule (Admin)
app.MapDelete("/api/schedules/{id:int}", async (int id, AppDbContext db) =>
{
    var schedule = await db.Schedules.FindAsync(id);
    if (schedule == null)
    {
        return Results.NotFound(new { message = $"Schedule with ID {id} not found." });
    }

    db.Schedules.Remove(schedule);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteSchedule");

#endregion

#region Reports Endpoints

// GET /api/reports - Fetch all reports for Admin & Live Feed
app.MapGet("/api/reports", async (AppDbContext db) =>
{
    var reports = await db.Reports.OrderByDescending(r => r.CreatedAt).ToListAsync();
    return Results.Ok(reports);
})
.WithName("GetReports");

// POST /api/reports - Save incoming DTO to PostgreSQL database
app.MapPost("/api/reports", async (CreateReportDto dto, AppDbContext db) =>
{
    var newReport = new Report
    {
        ReporterName = dto.ReporterName,
        MobileNumber = dto.MobileNumber,
        Ward = dto.Ward,
        WasteCategory = dto.WasteCategory,
        Description = dto.Description,
        Status = "Pending",
        CreatedAt = DateTime.UtcNow
    };

    db.Reports.Add(newReport);
    await db.SaveChangesAsync();

    return Results.Created($"/api/reports/{newReport.Id}", newReport);
})
.WithName("CreateReport");

// PUT /api/reports/{id} - Update report status or details (Admin Portal)
app.MapPut("/api/reports/{id:int}", async (int id, UpdateReportDto dto, AppDbContext db) =>
{
    var report = await db.Reports.FindAsync(id);
    if (report == null)
    {
        return Results.NotFound(new { message = $"Report with ID {id} not found." });
    }

    if (!string.IsNullOrWhiteSpace(dto.ReporterName)) report.ReporterName = dto.ReporterName;
    if (!string.IsNullOrWhiteSpace(dto.MobileNumber)) report.MobileNumber = dto.MobileNumber;
    if (!string.IsNullOrWhiteSpace(dto.Ward)) report.Ward = dto.Ward;
    if (!string.IsNullOrWhiteSpace(dto.WasteCategory)) report.WasteCategory = dto.WasteCategory;
    if (!string.IsNullOrWhiteSpace(dto.Description)) report.Description = dto.Description;
    if (!string.IsNullOrWhiteSpace(dto.Status)) report.Status = dto.Status;

    await db.SaveChangesAsync();
    return Results.Ok(report);
})
.WithName("UpdateReport");

// DELETE /api/reports/{id} - Delete report (Admin Portal)
app.MapDelete("/api/reports/{id:int}", async (int id, AppDbContext db) =>
{
    var report = await db.Reports.FindAsync(id);
    if (report == null)
    {
        return Results.NotFound(new { message = $"Report with ID {id} not found." });
    }

    db.Reports.Remove(report);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteReport");

#endregion

app.Run();