import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '@shared/models/notification.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = environment.apiUrl + '/notifications';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les notifications (réservé admin)
   */
  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}`);
  }

  /**
   * Récupérer les notifications du user connecté
   */
  getUserNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user`);
  }

  /**
   * Retenter l'envoi d'une notification (optionnel futur)
   */
  retryNotification(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/retry`, {});
  }
}
