import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** 🎯 Représente un patient côté frontend */
export interface PatientResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  cin: string;
  enabled: boolean;
  createdByAdmin: boolean;
  userId?: number;
}

/** 📦 Structure de réponse paginée depuis le backend */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // page actuelle
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private baseUrl = `${this.API_URL}/patients`;

  constructor() {}

  /**
   * ✅ Crée un nouveau patient (admin uniquement)
   */
  createPatient(payload: {
    nom: string;
    prenom: string;
    email: string;
    cin: string;
    genre?: string;
    dateNaissance?: string;
    adresse?: string;
    enabled?: boolean;
    userId?: number; // optionnel
  }): Observable<PatientResponse> {
    return this.http.post<PatientResponse>(this.baseUrl, payload);
  }

  /**
   * 🔄 Récupère tous les patients (non paginée - legacy)
   */
  getAllPatients(): Observable<PatientResponse[]> {
    return this.http.get<PatientResponse[]>(this.baseUrl);
  }

  /**
   * 🔁 Récupère les patients de manière paginée + filtrée
   */
  getPaginatedPatients(
    page = 0,
    size = 10,
    filters?: { nom?: string; createdByAdmin?: boolean; enabled?: boolean }
  ): Observable<PaginatedResponse<PatientResponse>> {
    const params: any = {
      page,
      size
    };

    if (filters?.nom) {
      params.nom = filters.nom;
    }
    if (filters?.createdByAdmin !== undefined) {
      params.createdByAdmin = filters.createdByAdmin;
    }
    if (filters?.enabled !== undefined) {
      params.enabled = filters.enabled;
    }

    return this.http.get<PaginatedResponse<PatientResponse>>(`${this.baseUrl}/paginated`, { params });
  }
}
