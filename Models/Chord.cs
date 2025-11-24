using System.ComponentModel.DataAnnotations;

namespace GuitarGuide.Models;

public class Chord
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = null!;

    // For simplicity store positions as JSON string, e.g. "["x",0,2,2,1,0]"
    public string PositionsJson { get; set; } = "[]";

    // Optional description
    public string? Description { get; set; }
}
