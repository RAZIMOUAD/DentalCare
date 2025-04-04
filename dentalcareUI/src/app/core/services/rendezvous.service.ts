import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RendezvousService {
  private api = 'http://localhost:8088/api/v1';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.api}/rendezvous`);
  }
}
