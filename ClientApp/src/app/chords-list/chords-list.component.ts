import { Component, OnInit } from '@angular/core';
import { ChordService } from '../chord.service';
import { Chord } from '../models/chord';

@Component({
  selector: 'app-chords-list',
  templateUrl: './chords-list.component.html'
})
export class ChordsListComponent implements OnInit {
  chords: Chord[] = [];

  newName = '';
  newPositions = '["x",0,2,2,1,0]';
  
  editingChord: Chord | null = null;
  editName = '';
  editPositions = '';

  constructor(private svc: ChordService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.list().subscribe(c => {
      this.chords = c;
    });
  }

  add() {
    if (!this.newName) return;
    const chord: Chord = { name: this.newName, positionsJson: this.newPositions };
    this.svc.create(chord).subscribe(() => {
      this.newName = '';
      this.newPositions = '["x",0,2,2,1,0]';
      this.load();
    });
  }

  startEdit(chord: Chord) {
    this.editingChord = chord;
    this.editName = chord.name;
    this.editPositions = chord.positionsJson || '[]';
  }

  cancelEdit() {
    this.editingChord = null;
    this.editName = '';
    this.editPositions = '';
  }

  saveEdit() {
    if (!this.editingChord || !this.editName) return;
    
    const updated: Chord = {
      id: this.editingChord.id,
      name: this.editName,
      positionsJson: this.editPositions
    };

    this.svc.update(this.editingChord.id!, updated).subscribe(() => {
      this.cancelEdit();
      this.load();
    });
  }

  delete(chord: Chord) {
    if (!confirm(`Tem certeza que deseja excluir o acorde "${chord.name}"?`)) return;
    
    this.svc.delete(chord.id!).subscribe(() => {
      this.load();
    });
  }
}
