import { Component, OnInit } from '@angular/core';
import { SongService } from '../song.service';
import { Song, MusicalElement } from '../models/song';
import { Chord } from '../models/chord';

@Component({
  selector: 'app-song-player',
  templateUrl: './song-player.component.html',
  styleUrls: ['./song-player.component.css']
})
export class SongPlayerComponent implements OnInit {
  songs: Song[] = [];
  selectedSong: Song | null = null;
  musicalElements: MusicalElement[] = [];
  currentBeat = 0;
  isPlaying = false;
  intervalId: any = null;
  animationFrameId: any = null;
  startTime: number = 0;
  pausedTime: number = 0;
  Math = Math; // Para usar no template

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.list().subscribe(songs => {
      this.songs = songs;
    });
  }

  selectSong(song: Song): void {
    this.selectedSong = song;
    this.stop();
    if (song.sequenceJson) {
      const parsed = JSON.parse(song.sequenceJson);
      // Convert all properties to numbers and add 10 empty beats at the start
      this.musicalElements = parsed.map((item: any) => ({
        ...item,
        beat: Number(item.beat) + 10, // Add 10 beats offset
        duration: Number(item.duration),
        chordId: item.chordId ? Number(item.chordId) : undefined,
        fret: item.fret !== undefined ? Number(item.fret) : undefined,
        string: item.string !== undefined ? Number(item.string) : undefined,
        noteFret: item.noteFret !== undefined ? Number(item.noteFret) : undefined,
        tabPositions: item.tabPositions || undefined
      }));
    } else {
      this.musicalElements = [];
    }
    
    this.currentBeat = 0;
  }

  play(): void {
    if (!this.selectedSong || this.isPlaying) return;
    
    this.isPlaying = true;
    const tempo = this.selectedSong.tempo || 120;
    const beatDuration = 60000 / tempo; // ms per beat
    
    this.startTime = performance.now() - (this.pausedTime || 0);
    
    const animate = (currentTime: number) => {
      if (!this.isPlaying) return;
      
      const elapsed = currentTime - this.startTime;
      this.currentBeat = elapsed / beatDuration;
      
      const totalBeats = this.getTotalBeats();
      if (this.currentBeat >= totalBeats) {
        this.currentBeat = 0;
        this.startTime = currentTime;
        this.pausedTime = 0;
      }
      
      this.animationFrameId = requestAnimationFrame(animate);
    };
    
    this.animationFrameId = requestAnimationFrame(animate);
  }

  pause(): void {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.pausedTime = this.currentBeat * (60000 / (this.selectedSong?.tempo || 120));
  }

  stop(): void {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.currentBeat = 0;
    this.startTime = 0;
    this.pausedTime = 0;
  }

  getTotalBeats(): number {
    if (this.musicalElements.length === 0) return 0;
    return Math.max(...this.musicalElements.map(e => e.beat + e.duration));
  }

  getChordById(id: number): Chord | undefined {
    // Try to get from chords array first (if exists)
    if (this.selectedSong?.chords) {
      return this.selectedSong.chords.find(c => c.id === id);
    }
    // Try from songChords structure
    const songAny = this.selectedSong as any;
    if (songAny?.songChords) {
      const songChord = songAny.songChords.find((sc: any) => sc.chordId === id || sc.chord?.id === id);
      return songChord?.chord;
    }
    return undefined;
  }

  getChordPositions(chordId: number): Array<string | number> {
    const chord = this.getChordById(chordId);
    if (!chord || !chord.positionsJson) return [];
    try {
      return JSON.parse(chord.positionsJson);
    } catch {
      return [];
    }
  }

  parseTabPositions(tabPositions: string): Array<string | number> {
    try {
      return JSON.parse(tabPositions);
    } catch {
      return [];
    }
  }

  getActiveElements(): MusicalElement[] {
    return this.musicalElements.filter(elem => 
      this.currentBeat >= elem.beat && this.currentBeat < (elem.beat + elem.duration)
    );
  }

  getElementsAtBeat(beat: number): MusicalElement[] {
    return this.musicalElements.filter(elem => 
      beat >= elem.beat && beat < (elem.beat + elem.duration)
    );
  }

  getScrollOffset(): number {
    // A linha vertical fica fixa em 250px da esquerda
    // Então movemos a tablatura para a esquerda baseado no beat atual
    // Offset negativo move a tablatura para a esquerda
    const fixedLinePosition = 250; // posição fixa da linha
    const beatWidth = 80; // largura de cada beat em pixels
    const initialOffset = 50; // offset inicial do SVG
    
    // Calcula quanto devemos mover a tablatura para a esquerda
    // para que o beat atual fique alinhado com a linha fixa
    return fixedLinePosition - (initialOffset + this.currentBeat * beatWidth);
  }
}
