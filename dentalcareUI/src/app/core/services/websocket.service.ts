import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { Subject } from 'rxjs';
import { RendezVousResponse } from '../../features/dashboard/models/rendezvous-response.model';
import {NotificationResponse} from '../../features/dashboard/models/notification-response.model';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient!: Client;

  // Subjects RDV
  public newRdv$ = new Subject<RendezVousResponse>();
  public confirmedRdv$ = new Subject<RendezVousResponse>();
  public rejectedRdv$ = new Subject<RendezVousResponse>();

  // Subject Notification
  public notification$ = new Subject<NotificationResponse>();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8088/ws'),
      debug: (str) => console.log('[WS] ' + str),
      reconnectDelay: 5000
    });
  }

  public connect(): void {
    this.stompClient.onConnect = () => {
      console.log('✅ WebSocket connecté');

      this.stompClient.subscribe('/topic/rdv/new', (message: IMessage) => {
        this.newRdv$.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/rdv/confirmed', (message: IMessage) => {
        this.confirmedRdv$.next(JSON.parse(message.body));
      });

      this.stompClient.subscribe('/topic/rdv/rejected', (message: IMessage) => {
        this.rejectedRdv$.next(JSON.parse(message.body));
      });

    this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
      this.notification$.next(JSON.parse(message.body));
    });
  };

    this.stompClient.activate();
  }

  public async disconnect(): Promise<void> {
    if (this.stompClient?.active) {
      try {
        await this.stompClient.deactivate();
        console.log('✅ WebSocket déconnecté proprement');
      } catch (error) {
        console.error('❌ Échec de déconnexion WebSocket', error);
      }
    }
  }

}
