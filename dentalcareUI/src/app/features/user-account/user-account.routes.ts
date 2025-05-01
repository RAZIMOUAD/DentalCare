// src/app/features/user-account/user-account.routes.ts

import { Routes } from '@angular/router';
import { AuthGuardUser } from '../../core/guards/auth-user.guard';
import { UserLayoutComponent } from '../../layouts/user-layout/user-layout.component';
import {BookingComponent} from './appointments/booking/booking.component';


export const USER_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuardUser],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./user-account.component').then(m => m.UserAccountComponent),
      }, {
        path: 'notifications',
        loadComponent: () => import('../user-account/notifications-user/notifications-user-page.component').then(m => m.NotificationsUserPageComponent)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'rendezvous'
      },
      {
        path: 'profil',
        loadComponent: () =>
          import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'prendre-rdv',
        component: BookingComponent
      }

    ]
  }
];
