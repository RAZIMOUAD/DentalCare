import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() fullName: string | null = null;
  @Input() notifications: number = 0;
  @Output() logout = new EventEmitter<void>();

  /**
   * Déclenche la demande de déconnexion (sera captée par dashboard.component.ts)
   */
  onLogout(): void {
    this.logout.emit();
  }
}
