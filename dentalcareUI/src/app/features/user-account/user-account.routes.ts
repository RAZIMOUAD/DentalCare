// src/app/features/user-account/user-account.routes.ts

import { Routes } from '@angular/router';
import { AuthGuardUser } from '../../core/guards/auth-user.guard';
import { UserLayoutComponent } from '../../layouts/user-layout/user-layout.component';

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
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'rendezvous'
      }
    ]
  }
];
