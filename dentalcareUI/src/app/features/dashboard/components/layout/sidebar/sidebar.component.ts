import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isOpen: boolean = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  /**
   * 🧭 Navigation principale avec icônes Lucide
   */
  navItems = [
    { label: 'Accueil', icon: 'Home', route: '/dashboard/accueil' },
    { label: 'Patients', icon: 'Users', route: '/dashboard/patients' },
    { label: 'Rendez-vous', icon: 'CalendarDays', route: '/dashboard/rendezvous' },
    { label: 'Messages', icon: 'MessageSquare', route: '/dashboard/messages' },
    { label: 'Notifications', icon: 'Bell', route: '/dashboard/notifications' },
    { label: 'Statistiques', icon: 'BarChart2', route: '/dashboard/statistiques' },
    { label: 'Paramètres', icon: 'Settings', route: '/dashboard/parametres' },
  ];

  /**
   * 📂 Affichage de sous-menus dynamiques (si besoin)
   */
  openSubmenu: string | null = null;
  toggleSubmenu(label: string): void {
    this.openSubmenu = this.openSubmenu === label ? null : label;
  }

  /**
   * 🌓 Toggle sidebar (mobile / desktop)
   */
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  /**
   * 🔐 Déconnexion
   */
  onLogout(): void {
    this.authService.logout();
  }
}
