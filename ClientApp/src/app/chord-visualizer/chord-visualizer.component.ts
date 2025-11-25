import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chord-visualizer',
  templateUrl: './chord-visualizer.component.html'
})
export class ChordVisualizerComponent implements OnChanges {
  @Input() positionsJson = '[]';
  positions: Array<string | number> = [];

  ngOnChanges(): void {
    try {
      const parsed = JSON.parse(this.positionsJson);
      if (Array.isArray(parsed)) this.positions = parsed;
      else this.positions = [];
    } catch {
      this.positions = [];
    }
  }

  isValidNumber(value: string | number): boolean {
    return !isNaN(Number(value));
  }

  toNumber(value: string | number): number {
    return Number(value);
  }
}
