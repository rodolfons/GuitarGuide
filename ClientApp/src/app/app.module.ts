import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ChordsListComponent } from './chords-list/chords-list.component';
import { ChordVisualizerComponent } from './chord-visualizer/chord-visualizer.component';

@NgModule({
  declarations: [AppComponent, ChordsListComponent, ChordVisualizerComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
