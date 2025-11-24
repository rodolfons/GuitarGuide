import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chord } from './models/chord';

@Injectable({ providedIn: 'root' })
export class ChordService {
  private api = 'http://localhost:5000/api/chords';

  constructor(private http: HttpClient) {}

  list(): Observable<Chord[]> {
    return this.http.get<Chord[]>(this.api);
  }

  create(chord: Chord): Observable<any> {
    return this.http.post(this.api, chord);
  }
}
