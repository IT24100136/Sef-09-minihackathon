using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SmartKunu.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ReporterName = table.Column<string>(type: "text", nullable: false),
                    MobileNumber = table.Column<string>(type: "text", nullable: false),
                    Ward = table.Column<string>(type: "text", nullable: false),
                    WasteCategory = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Municipality = table.Column<string>(type: "text", nullable: false),
                    Ward = table.Column<string>(type: "text", nullable: false),
                    WasteCategory = table.Column<string>(type: "text", nullable: false),
                    PickupDates = table.Column<string>(type: "text", nullable: false),
                    RouteInfo = table.Column<string>(type: "text", nullable: false),
                    Guidelines = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Schedules",
                columns: new[] { "Id", "Guidelines", "Municipality", "PickupDates", "RouteInfo", "Ward", "WasteCategory" },
                values: new object[,]
                {
                    { 1, "CMC will reject mixed polythene bags", "Colombo Municipal Council", "Every Monday & Thursday", "Galle Road Corridor", "Colombo 03 - Kollupitiya", "Perishable Organic" },
                    { 2, "Clean & dry plastics only", "Colombo Municipal Council", "Every Wednesday", "Dharmapala Mawatha Sector", "Colombo 07 - Cinnamon Gardens", "Recyclable Plastics" },
                    { 3, "Flatten all cardboard cartons", "Dehiwala-Mount Lavinia MC", "Every Tuesday", "Vandervort Place & Station Rd", "Dehiwala Ward 4", "Paper/Cardboard" },
                    { 4, "Includes appliances, batteries & scrap metal", "Dehiwala-Mount Lavinia MC", "Last Friday of the month", "Ward 4 Community Drop", "Dehiwala Ward 4", "Electronic Waste" },
                    { 5, "Only biodegradable waste collected", "Kaduwela Municipal Council", "Monday, Wednesday, Friday", "Main Road Zone", "Battaramulla Ward 2", "Perishable Organic" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Schedules");
        }
    }
}
