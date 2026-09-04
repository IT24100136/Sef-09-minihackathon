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

// Add Swagger/OpenAPI services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Member 4 will register AppDbContext here

var app = builder.Build();

// Enable Swagger UI and CORS
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowFrontend");

// Mock Schedules Dataset
var mockSchedules = new List<Schedule>
{
    new Schedule
    {
        Id = 1,
        Municipality = "Colombo Municipal Council",
        Ward = "Colombo 03 - Kollupitiya",
        WasteCategory = "Perishable Organic",
        PickupDates = "Every Monday & Thursday",
        RouteInfo = "Galle Road Corridor",
        Guidelines = "CMC will reject mixed polythene bags"
    },
    new Schedule
    {
        Id = 2,
        Municipality = "Colombo Municipal Council",
        Ward = "Colombo 07 - Cinnamon Gardens",
        WasteCategory = "Recyclable Plastics",
        PickupDates = "Every Wednesday",
        RouteInfo = "Dharmapala Mawatha Sector",
        Guidelines = "Clean & dry plastics only"
    },
    new Schedule
    {
        Id = 3,
        Municipality = "Dehiwala-Mount Lavinia MC",
        Ward = "Dehiwala Ward 4",
        WasteCategory = "Paper/Cardboard",
        PickupDates = "Every Tuesday",
        RouteInfo = "Vandervort Place & Station Rd",
        Guidelines = "Flatten all cardboard cartons"
    },
    new Schedule
    {
        Id = 4,
        Municipality = "Dehiwala-Mount Lavinia MC",
        Ward = "Dehiwala Ward 4",
        WasteCategory = "Electronic Waste",
        PickupDates = "Last Friday of the month",
        RouteInfo = "Ward 4 Community Drop",
        Guidelines = "Includes appliances, batteries & scrap metal"
    },
    new Schedule
    {
        Id = 5,
        Municipality = "Kaduwela Municipal Council",
        Ward = "Battaramulla Ward 2",
        WasteCategory = "Perishable Organic",
        PickupDates = "Monday, Wednesday, Friday",
        RouteInfo = "Main Road Zone",
        Guidelines = "Only biodegradable waste collected"
    }
};

// Endpoint 1: GET /api/schedules
app.MapGet("/api/schedules", () =>
{
    return Results.Ok(mockSchedules);
})
.WithName("GetSchedules");

// Endpoint 2: POST /api/reports
app.MapPost("/api/reports", (CreateReportDto dto) =>
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

    // Member 4 will save to AppDbContext here

    return Results.Created($"/api/reports/{newReport.Id}", newReport);
})
.WithName("CreateReport");

app.Run();