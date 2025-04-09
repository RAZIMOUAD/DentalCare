// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { authRoutes } from './features/auth/auth.routes';
import { AuthGuardUser } from './core/guards/auth-user.guard';
import { PUBLIC_PAGES_ROUTES } from './features/public-pages/ublic-pages.routes';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'user-account',
    canActivate: [AuthGuardUser],
    loadComponent: () =>
      import('./features/user-account/user-account.component').then(m => m.UserAccountComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(m => m.dashboardRoutes),

  },
  ...PUBLIC_PAGES_ROUTES,
  ...authRoutes
  // Ajoute d'autres routes ici
];
