import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages = [
    {
      sender: 'Admin Zahra',
      date: '2025-05-30',
      content: 'Merci de respecter vos rendez-vous et d’arriver 10 minutes à l’avance.'
    },
    {
      sender: 'Admin Zahra',
      date: '2025-05-27',
      content: 'Votre prochain rendez-vous est en attente de confirmation.'
    },
    {
      sender: 'Admin Zahra',
      date: '2025-05-22',
      content: 'Merci pour votre fidélité. N’hésitez pas à nous contacter pour toute question.'
    }
  ];
}
