using Microsoft.EntityFrameworkCore;
using SmartKunu.Server.Models;

namespace SmartKunu.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Report> Reports => Set<Report>();
    public DbSet<Schedule> Schedules => Set<Schedule>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed 5 mock schedules into PostgreSQL database
        modelBuilder.Entity<Schedule>().HasData(
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
        );
    }
}
