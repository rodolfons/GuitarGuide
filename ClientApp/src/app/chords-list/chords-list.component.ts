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

  constructor(private svc: ChordService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.list().subscribe(c => (this.chords = c));
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
}
