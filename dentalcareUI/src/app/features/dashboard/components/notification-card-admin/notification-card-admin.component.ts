import { Component, Input } from '@angular/core';
import { Notification } from '@shared/models/notification.model';
import {LucideIconsModule} from '@shared/modules/lucide-icons.module'; // Chemin à adapter si besoin
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-notification-card-admin',
  standalone: true,
  imports: [LucideIconsModule, CommonModule],
  templateUrl: './notification-card-admin.component.html',
  styleUrls: ['./notification-card-admin.component.css'],
})
export class NotificationCardAdminComponent {
  @Input() notification!: Notification;

  // Retourne la classe Tailwind CSS selon le statut
  getStatusClasses(): string {
    switch (this.notification.status) {
      case 'SUCCESS':
        return 'text-green-600 bg-green-100';
      case 'FAILURE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  // Retourne la couleur du badge selon le type de notification
  getTypeBadgeClasses(): string {
    switch (this.notification.type) {
      case 'NEW_APPOINTMENT':
        return 'bg-blue-100 text-blue-600';
      case 'REMINDER':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  // Retourne l'icône à utiliser pour le statut
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

  // Format simplifié Date/Heure sans moment.js
  formatDateTime(datetime: string): string {
    const date = new Date(datetime);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
