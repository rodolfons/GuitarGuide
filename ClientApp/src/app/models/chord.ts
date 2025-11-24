export interface Chord {
  id?: number;
  name: string;
  positionsJson: string; // JSON string representation of positions, e.g. "[\"x\",0,2,2,1,0]"
  description?: string;
}
