// src/app/layouts/dashboard-layout/dashboard-layout.component.ts

import {Component, inject, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../features/dashboard/components/layout/sidebar/sidebar.component';
import { HeaderComponent } from '../../features/dashboard/components/layout/header/header.component';
import {AuthService} from '../../core/services/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,  // ✅ Sidebar de l’admin
    HeaderComponent    // ✅ Header contenant photo, logout, etc.
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  animations: [
    trigger('fadeInDashboard', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardLayoutComponent implements OnInit{

  isSidebarOpen: boolean = true;
  fullName: string | null = null;

  private authService = inject(AuthService);

  ngOnInit(): void {
    const decoded = this.authService.getDecodedToken();
    this.fullName = decoded ? decoded.sub : 'Administrateur';
    console.log('✅ DashboardComponent chargé');
  }
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  logout(): void {
    this.authService.logout();
  }
}
