import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RendezVousResponse } from '../../features/dashboard/models/rendezvous-response.model'; // à créer
import { RendezVousRequest } from '../../features/dashboard/models/rendezvous-request.model';   // à créer

@Injectable({ providedIn: 'root' })
export class RendezvousService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET tous les RDV (ADMIN) */
  getAll(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous`);
  }

  /** GET RDV par date */
  getByDate(date: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-date`, {
      params: { date }
    });
  }

  /** GET mes RDV (USER connecté) */
  getMyRendezVous(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-user`);
  }

  /** POST nouveau RDV */
  createRendezVous(data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.post<RendezVousResponse>(`${this.api}/rendezvous`, data);
  }

  /** DELETE RDV par ID (ADMIN) */
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/rendezvous/${id}`);
  }
}
