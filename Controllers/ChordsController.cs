using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GuitarGuide.Data;
using GuitarGuide.Models;

[ApiController]
[Route("api/[controller]")]
public class ChordsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ChordsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var chords = await _db.Chords.AsNoTracking().ToListAsync();
        return Ok(chords);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Chord chord)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        _db.Chords.Add(chord);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = chord.Id }, chord);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Chord chord)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var existing = await _db.Chords.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = chord.Name;
        existing.PositionsJson = chord.PositionsJson;

        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var chord = await _db.Chords.FindAsync(id);
        if (chord == null) return NotFound();

        _db.Chords.Remove(chord);
        await _db.SaveChangesAsync();
        return Ok();
    }
}
