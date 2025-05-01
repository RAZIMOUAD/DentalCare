import SockJS from 'sockjs-client/dist/sockjs.min.js';
import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';


@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient!: Client;

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8088/ws'),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });
  }

  public connect(onMessageReceived: (message: string) => void) {
    this.stompClient.onConnect = () => {
      console.log('✅ WebSocket connecté');
      this.stompClient.subscribe('/topic/rdv', (message) => {
        const notif = JSON.parse(message.body);
        onMessageReceived(notif.content);
      });
    };
    this.stompClient.activate();
  }


  public disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}
