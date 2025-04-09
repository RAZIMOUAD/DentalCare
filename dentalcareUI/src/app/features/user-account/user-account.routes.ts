// src/app/features/user-account/user-account.routes.ts

import { Routes } from '@angular/router';
import { AuthGuardUser} from '../../core/guards/auth-user.guard';

export const USER_ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuardUser],
    loadComponent: () =>
      import('./user-account.component').then(m => m.UserAccountComponent),
    children: [
      // 🧩 Ajoutez ici vos sous-pages (ex: dashboard, rendez-vous, profil, etc.)
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      // }
    ],
  },
];
