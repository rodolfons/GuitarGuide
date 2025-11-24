using Microsoft.EntityFrameworkCore;
using GuitarGuide.Models;

namespace GuitarGuide.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Chord> Chords => Set<Chord>();
}
