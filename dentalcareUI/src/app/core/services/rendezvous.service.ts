import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RendezVousResponse } from '../../features/dashboard/models/rendezvous-response.model';
import { RendezVousRequest } from '../../features/dashboard/models/rendezvous-request.model';

@Injectable({ providedIn: 'root' })
export class RendezvousService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET tous les RDV (ADMIN) */
  getAll(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/all`);
  }

  /** 🔍 GET RDV par date */
  getByDate(date: string): Observable<RendezVousResponse[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-date`, { params });
  }
  /** GET tous les RDV d’un mois spécifique (ADMIN ou USER) */
  getByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-month`, {
      params: { year, month }
    });
  }

  /** 🔍 Récupérer les RDV d’un mois donné à partir d’une date LocalDate (format 'YYYY-MM-DD') */
  getByMonthDate(date: string): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/by-month-date`, {
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
  /** ✅ Confirmer un RDV */
  confirmRendezVous(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/rendezvous/${id}/confirm`, {});
  }

  /** ⚠️ Rejeter un RDV */
  rejectRendezVous(id: number): Observable<void> {
    return this.http.patch<void>(`${this.api}/rendezvous/${id}/reject`, {});
  }


  /** DELETE RDV par ID (ADMIN) */
  deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/rendezvous/${id}`);
  }
  /** ✏️ PUT modifier un RDV */
  updateRendezVous(id: number, data: RendezVousRequest): Observable<RendezVousResponse> {
    return this.http.put<RendezVousResponse>(`${this.api}/rendezvous/${id}`, data);
  }

  /** 🌍 GET RDV publics (optionnel pour page sans login) */
  getPublicDisponibilites(): Observable<RendezVousResponse[]> {
    return this.http.get<RendezVousResponse[]>(`${this.api}/rendezvous/public`);
  }
}
