import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SongService } from '../song.service';

@Component({
  selector: 'app-songs-list',
  templateUrl: './songs-list.component.html'
})
export class SongsListComponent implements OnInit {
  songs: any[] = [];
  @Output() editSong = new EventEmitter<any>();
  @Output() newSong = new EventEmitter<void>();

  constructor(private svc: SongService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.svc.list().subscribe(s => {
      this.songs = s;
    });
  }

  onNew() {
    this.newSong.emit();
  }

  onEdit(song: any) {
    this.editSong.emit(song);
  }

  delete(song: any) {
    if (!confirm(`Tem certeza que deseja excluir a música "${song.name}"?`)) return;
    
    this.svc.delete(song.id).subscribe(() => {
      this.load();
    });
  }
}
