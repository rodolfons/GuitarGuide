import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SongService } from '../song.service';
import { ChordService } from '../chord.service';
import { Chord } from '../models/chord';
import { MusicalElement } from '../models/song';

@Component({
  selector: 'app-song-form',
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.css']
})
export class SongFormComponent implements OnInit, OnChanges {
  @Input() songToEdit: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  name = '';
  artist = '';
  tuning = 'Standard';
  tempo = 120;
  
  availableChords: Chord[] = [];
  selectedChordIds: number[] = [];
  musicalElements: MusicalElement[] = [];
  
  // For adding elements
  elementType: 'chord' | 'note' | 'tab' = 'chord';
  beat = 0;
  duration = 4;
  
  // For chords
  selectedChordId: number | null = null;
  fret = 0;
  
  // For single notes
  noteString = 0;
  noteFret = 0;
  
  // For tablature
  tabPositions = '[0,0,0,0,0,0]';
  
  // For editing
  editingIndex: number | null = null;

  constructor(
    private songService: SongService,
    private chordService: ChordService
  ) {}

  ngOnInit(): void {
    this.chordService.list().subscribe(chords => {
      this.availableChords = chords;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songToEdit'] && this.songToEdit) {
      this.loadSongData();
    } else if (changes['songToEdit'] && !this.songToEdit) {
      this.reset();
    }
  }

  loadSongData(): void {
    this.name = this.songToEdit.name || '';
    this.artist = this.songToEdit.artist || '';
    this.tuning = this.songToEdit.tuning || 'Standard';
    this.tempo = this.songToEdit.tempo || 120;
    
    // Parse musical elements (unified sequence)
    try {
      this.musicalElements = this.songToEdit.sequenceJson ? JSON.parse(this.songToEdit.sequenceJson) : [];
    } catch {
      this.musicalElements = [];
    }
    
    // Load selected chords
    this.selectedChordIds = this.songToEdit.songChords?.map((sc: any) => sc.chordId) || [];
  }

  toggleChord(chordId: number): void {
    const index = this.selectedChordIds.indexOf(chordId);
    if (index > -1) {
      this.selectedChordIds.splice(index, 1);
    } else {
      this.selectedChordIds.push(chordId);
    }
  }

  isChordSelected(chordId: number): boolean {
    return this.selectedChordIds.includes(chordId);
  }

  addElement(): void {
    if (this.elementType === 'chord') {
      if (this.selectedChordId !== null) {
        this.musicalElements.push({
          type: 'chord',
          beat: this.beat,
          duration: this.duration,
          chordId: this.selectedChordId,
          fret: this.fret
        });
        // Auto-select the chord if not already selected
        if (!this.selectedChordIds.includes(this.selectedChordId)) {
          this.selectedChordIds.push(this.selectedChordId);
        }
      }
    } else if (this.elementType === 'note') {
      this.musicalElements.push({
        type: 'note',
        beat: this.beat,
        duration: this.duration,
        string: this.noteString,
        noteFret: this.noteFret
      });
    } else if (this.elementType === 'tab') {
      this.musicalElements.push({
        type: 'tab',
        beat: this.beat,
        duration: this.duration,
        tabPositions: this.tabPositions
      });
    }
    // Sort by beat
    this.musicalElements.sort((a, b) => a.beat - b.beat);
  }

  removeElement(index: number): void {
    this.musicalElements.splice(index, 1);
    if (this.editingIndex === index) {
      this.cancelEdit();
    }
  }
  
  editElement(index: number): void {
    const elem = this.musicalElements[index];
    this.editingIndex = index;
    this.elementType = elem.type;
    this.beat = elem.beat;
    this.duration = elem.duration;
    
    if (elem.type === 'chord') {
      this.selectedChordId = elem.chordId!;
      this.fret = elem.fret || 0;
    } else if (elem.type === 'note') {
      this.noteString = elem.string!;
      this.noteFret = elem.noteFret!;
    } else if (elem.type === 'tab') {
      this.tabPositions = elem.tabPositions!;
    }
  }
  
  updateElement(): void {
    if (this.editingIndex === null) return;
    
    if (this.elementType === 'chord') {
      if (this.selectedChordId !== null) {
        this.musicalElements[this.editingIndex] = {
          type: 'chord',
          beat: this.beat,
          duration: this.duration,
          chordId: this.selectedChordId,
          fret: this.fret
        };
      }
    } else if (this.elementType === 'note') {
      this.musicalElements[this.editingIndex] = {
        type: 'note',
        beat: this.beat,
        duration: this.duration,
        string: this.noteString,
        noteFret: this.noteFret
      };
    } else if (this.elementType === 'tab') {
      this.musicalElements[this.editingIndex] = {
        type: 'tab',
        beat: this.beat,
        duration: this.duration,
        tabPositions: this.tabPositions
      };
    }
    
    this.musicalElements.sort((a, b) => a.beat - b.beat);
    this.cancelEdit();
  }
  
  cancelEdit(): void {
    this.editingIndex = null;
    this.beat = 0;
    this.duration = 4;
    this.selectedChordId = null;
    this.fret = 0;
    this.noteString = 0;
    this.noteFret = 0;
    this.tabPositions = '[0,0,0,0,0,0]';
  }
  
  parseTabPositions(tabPositions: string): string {
    try {
      const positions = JSON.parse(tabPositions);
      return positions.map((pos: any, idx: number) => {
        const stringNames = ['E(1ª)', 'B(2ª)', 'G(3ª)', 'D(4ª)', 'A(5ª)', 'E(6ª)'];
        return `${stringNames[idx]}:${pos}`;
      }).join(', ');
    } catch {
      return tabPositions;
    }
  }

  getStringName(stringIndex: number): string {
    return ['E (1ª)', 'B (2ª)', 'G (3ª)', 'D (4ª)', 'A (5ª)', 'E (6ª)'][stringIndex];
  }

  getChordName(chordId: number): string {
    return this.availableChords.find(c => c.id === chordId)?.name || '?';
  }

  save(): void {
    const sequenceJson = JSON.stringify(this.musicalElements);
    
    const data = {
      name: this.name,
      artist: this.artist || null,
      tuning: this.tuning || null,
      tempo: this.tempo || null,
      sequenceJson,
      tablatureJson: '[]', // Keep for backward compatibility
      chordIds: this.selectedChordIds
    };

    const operation = this.songToEdit 
      ? this.songService.update(this.songToEdit.id, data)
      : this.songService.create(data);

    operation.subscribe({
      next: (result: any) => {
        alert(this.songToEdit ? 'Música atualizada com sucesso!' : 'Música cadastrada com sucesso!');
        this.reset();
        this.saved.emit();
      },
      error: (err: any) => {
        console.error('Erro ao salvar música:', err);
        alert('Erro ao salvar música. Verifique o console.');
      }
    });
  }

  cancel(): void {
    this.reset();
    this.cancelled.emit();
  }

  reset(): void {
    this.name = '';
    this.artist = '';
    this.tuning = 'Standard';
    this.tempo = 120;
    this.selectedChordIds = [];
    this.musicalElements = [];
  }
}
