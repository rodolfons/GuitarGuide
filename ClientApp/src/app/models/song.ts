import { Chord } from './chord';

export interface ChordSequenceItem {
  chordId: number;
  duration: number; // beats duration
  fret: number;     // starting fret position
}

export interface TablatureNote {
  beat: number;     // position in beats
  string: number;   // 0-5 (E, B, G, D, A, E)
  fret: number;     // fret number
  duration: number; // beats duration
}

export interface MusicalElement {
  type: 'chord' | 'note' | 'tab';
  beat: number;      // position in beats
  duration: number;  // beats duration
  
  // For chords
  chordId?: number;
  fret?: number;     // starting fret position
  
  // For single notes
  string?: number;   // 0-5 (E, B, G, D, A, E)
  noteFret?: number; // fret number for the note
  
  // For tablature (all strings at once)
  tabPositions?: string; // JSON string like "[0,0,0,0,7,0]"
}

export interface Song {
  id?: number;
  name: string;
  artist?: string;
  tuning?: string;
  tempo?: number;
  sequenceJson?: string;
  tablatureJson?: string;
  chords?: Chord[];
}
