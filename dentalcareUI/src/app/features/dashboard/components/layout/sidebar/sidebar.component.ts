import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() toggleSidebar = new EventEmitter<void>()
  constructor(private authService: AuthService) {}
  navItems = [
    { label: 'Accueil', icon: '🏠', route: '/dashboard/accueil' },
    { label: 'Patients', icon: '👥', route: '/dashboard/patients' },
    { label: 'Rendez-vous', icon: '📅', route: '/dashboard/rendezvous' },
    { label: 'Messages', icon: '💬', route: '/dashboard/messages' },
    { label: 'Statistiques', icon: '📊', route: '/dashboard/statistiques' },
    { label: 'Paramètres', icon: '⚙️', route: '/dashboard/parametres' },
  ];
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
  onLogout(): void {
    this.authService.logout();
  }
}
