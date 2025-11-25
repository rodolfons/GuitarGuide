namespace GuitarGuide.Models;

public class Song
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Artist { get; set; }
    public string? Tuning { get; set; }
    public int? Tempo { get; set; }
    
    // JSON array with chord sequence: [{ chordId: 1, duration: 4, fret: 0 }, ...]
    public string? SequenceJson { get; set; }
    
    // JSON array with tablature notes: [{ beat: 0, string: 0, fret: 3, duration: 1 }, ...]
    public string? TablatureJson { get; set; }
    
    public ICollection<SongChord> SongChords { get; set; } = new List<SongChord>();
}

// Junction table for many-to-many relationship
public class SongChord
{
    public int SongId { get; set; }
    public Song Song { get; set; } = null!;
    
    public int ChordId { get; set; }
    public Chord Chord { get; set; } = null!;
}
