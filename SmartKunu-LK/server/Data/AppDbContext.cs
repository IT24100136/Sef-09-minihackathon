using Microsoft.EntityFrameworkCore;
using SmartKunu.Server.Models;

namespace SmartKunu.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Report> Reports => Set<Report>();
}
