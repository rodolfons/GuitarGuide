using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GuitarGuide.Data;
using GuitarGuide.Models;

namespace GuitarGuide.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SongsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SongsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetSongs()
    {
        var songs = await _context.Songs
            .Include(s => s.SongChords)
            .ThenInclude(sc => sc.Chord)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Artist,
                s.Tuning,
                s.Tempo,
                s.SequenceJson,
                s.TablatureJson,
                SongChords = s.SongChords.Select(sc => new
                {
                    sc.ChordId,
                    Chord = new
                    {
                        sc.Chord.Id,
                        sc.Chord.Name,
                        sc.Chord.PositionsJson,
                        sc.Chord.Description
                    }
                }).ToList()
            })
            .ToListAsync();

        return Ok(songs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetSong(int id)
    {
        var song = await _context.Songs
            .Include(s => s.SongChords)
            .ThenInclude(sc => sc.Chord)
            .Where(s => s.Id == id)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Artist,
                s.Tuning,
                s.Tempo,
                s.SequenceJson,
                s.TablatureJson,
                Chords = s.SongChords.Select(sc => new
                {
                    sc.Chord.Id,
                    sc.Chord.Name,
                    sc.Chord.PositionsJson,
                    sc.Chord.Description
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (song == null)
            return NotFound();

        return Ok(song);
    }

    [HttpPost]
    public async Task<ActionResult<Song>> CreateSong(SongCreateDto dto)
    {
        try
        {
            var song = new Song
            {
                Name = dto.Name,
                Artist = dto.Artist,
                Tuning = dto.Tuning,
                Tempo = dto.Tempo,
                SequenceJson = dto.SequenceJson,
                TablatureJson = dto.TablatureJson
            };

            _context.Songs.Add(song);
            await _context.SaveChangesAsync();

            // Add chord relationships
            if (dto.ChordIds != null && dto.ChordIds.Any())
            {
                foreach (var chordId in dto.ChordIds)
                {
                    _context.SongChords.Add(new SongChord
                    {
                        SongId = song.Id,
                        ChordId = chordId
                    });
                }
                await _context.SaveChangesAsync();
            }

            return Ok(new { id = song.Id, message = "Música criada com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSong(int id, SongCreateDto dto)
    {
        var song = await _context.Songs
            .Include(s => s.SongChords)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (song == null)
            return NotFound();

        song.Name = dto.Name;
        song.Artist = dto.Artist;
        song.Tuning = dto.Tuning;
        song.Tempo = dto.Tempo;
        song.SequenceJson = dto.SequenceJson;
        song.TablatureJson = dto.TablatureJson;

        // Update chord relationships
        _context.SongChords.RemoveRange(song.SongChords);
        
        if (dto.ChordIds != null && dto.ChordIds.Any())
        {
            foreach (var chordId in dto.ChordIds)
            {
                _context.SongChords.Add(new SongChord
                {
                    SongId = song.Id,
                    ChordId = chordId
                });
            }
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSong(int id)
    {
        var song = await _context.Songs.FindAsync(id);
        if (song == null)
            return NotFound();

        _context.Songs.Remove(song);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public record SongCreateDto(
    string Name,
    string? Artist,
    string? Tuning,
    int? Tempo,
    string? SequenceJson,
    string? TablatureJson,
    int[]? ChordIds
);
