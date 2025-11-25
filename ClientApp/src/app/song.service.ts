import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from './models/song';

@Injectable({ providedIn: 'root' })
export class SongService {
  private api = 'http://localhost:5000/api/songs';

  constructor(private http: HttpClient) {}

  list(): Observable<Song[]> {
    return this.http.get<Song[]>(this.api);
  }

  get(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.api}/${id}`);
  }

  create(song: any): Observable<any> {
    return this.http.post<any>(this.api, song);
  }

  update(id: number, song: any): Observable<any> {
    return this.http.put<any>(`${this.api}/${id}`, song);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
