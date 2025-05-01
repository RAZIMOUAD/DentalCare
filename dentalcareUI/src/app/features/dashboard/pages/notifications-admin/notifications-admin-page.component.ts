import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCardAdminComponent } from '../../components/notification-card-admin/notification-card-admin.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { Notification } from '@shared/models/notification.model';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notifications-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationCardAdminComponent],
  templateUrl: './notifications-admin-page.component.html',
  styleUrls: ['./notifications-admin-page.component.css']
})
export class NotificationsAdminPageComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedStatus: 'SUCCESS' | 'FAILURE' | '' = '';
  selectedType: 'NEW_APPOINTMENT' | 'REMINDER' | '' = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 6;

  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.getAllNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur récupération notifications :', err);
        this.snackBar.open('Erreur lors du chargement des notifications.', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter((notif) => {
      const matchesSearch =
        this.searchTerm.trim() === '' ||
        notif.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        notif.type.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus =
        this.selectedStatus === '' || notif.status === this.selectedStatus;

      const matchesType =
        this.selectedType === '' || notif.type === this.selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });

    this.currentPage = 1; // Reset page si filtre appliqué
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedType = '';
    this.applyFilters();
  }

  // Pagination utilitaire
  get paginatedNotifications(): Notification[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredNotifications.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNotifications.length / this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
