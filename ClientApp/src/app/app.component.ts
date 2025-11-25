import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div style="min-height: 100vh; background: #f5f5f5;">
      <nav style="background: #333; color: white; padding: 15px 20px; margin-bottom: 20px;">
        <h1 style="margin: 0; display: inline-block;">🎸 GuitarGuide</h1>
        <div style="display: inline-block; margin-left: 30px;">
          <button (click)="currentView = 'chords'" 
                  [style.background]="currentView === 'chords' ? '#007bff' : '#555'"
                  style="padding: 8px 16px; margin-right: 10px; color: white; border: none; cursor: pointer; border-radius: 3px;">
            Acordes
          </button>
          <button (click)="currentView = 'songs-list'" 
                  [style.background]="currentView === 'songs-list' ? '#007bff' : '#555'"
                  style="padding: 8px 16px; margin-right: 10px; color: white; border: none; cursor: pointer; border-radius: 3px;">
            Músicas
          </button>
          <button (click)="currentView = 'song-player'" 
                  [style.background]="currentView === 'song-player' ? '#007bff' : '#555'"
                  style="padding: 8px 16px; color: white; border: none; cursor: pointer; border-radius: 3px;">
            Tocar Música
          </button>
        </div>
      </nav>
      
      <div style="padding: 0 20px;">
        <app-chords-list *ngIf="currentView === 'chords'"></app-chords-list>
        <app-songs-list *ngIf="currentView === 'songs-list'" 
                        (newSong)="onNewSong()" 
                        (editSong)="onEditSong($event)"></app-songs-list>
        <app-song-form *ngIf="currentView === 'song-form'" 
                       [songToEdit]="selectedSong"
                       (saved)="onSongSaved()"
                       (cancelled)="onCancelEdit()"></app-song-form>
        <app-song-player *ngIf="currentView === 'song-player'"></app-song-player>
      </div>
    </div>
  `
})
export class AppComponent {
  currentView: 'chords' | 'songs-list' | 'song-form' | 'song-player' = 'chords';
  selectedSong: any = null;

  onNewSong() {
    this.selectedSong = null;
    this.currentView = 'song-form';
  }

  onEditSong(song: any) {
    this.selectedSong = song;
    this.currentView = 'song-form';
  }

  onSongSaved() {
    this.currentView = 'songs-list';
    this.selectedSong = null;
  }

  onCancelEdit() {
    this.currentView = 'songs-list';
    this.selectedSong = null;
  }
}

