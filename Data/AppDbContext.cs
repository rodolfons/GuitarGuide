using Microsoft.EntityFrameworkCore;
using GuitarGuide.Models;

namespace GuitarGuide.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Chord> Chords => Set<Chord>();
    public DbSet<Song> Songs => Set<Song>();
    public DbSet<SongChord> SongChords => Set<SongChord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure many-to-many relationship
        modelBuilder.Entity<SongChord>()
            .HasKey(sc => new { sc.SongId, sc.ChordId });

        modelBuilder.Entity<SongChord>()
            .HasOne(sc => sc.Song)
            .WithMany(s => s.SongChords)
            .HasForeignKey(sc => sc.SongId);

        modelBuilder.Entity<SongChord>()
            .HasOne(sc => sc.Chord)
            .WithMany()
            .HasForeignKey(sc => sc.ChordId);
    }
}
