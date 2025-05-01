
import { Component, Input } from '@angular/core';
import { Notification } from '@shared/models/notification.model';
import { CommonModule } from '@angular/common';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-notification-card-user',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './notification-card-user.component.html',
  styleUrls: ['./notification-card-user.component.css'],
})
export class NotificationCardUserComponent {
  @Input() notification!: Notification;

  // Retourne la classe CSS pour le statut (succès/échec/autre)
  getStatusClasses(): string {
    switch (this.notification.status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILURE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  }

  // Retourne l'icône Lucide correspondante au statut
  getStatusIcon(): string {
    switch (this.notification.status) {
      case 'SUCCESS':
        return 'check-circle';
      case 'FAILURE':
        return 'x-circle';
      default:
        return 'alert-circle';
    }
  }

  // Formate la date de tentative
  formatDate(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleDateString('fr-FR');
  }

  // Formate l'heure de tentative
  formatTime(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
