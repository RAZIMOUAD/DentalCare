import { Routes } from '@angular/router';
import { RedirectIfAuthenticatedGuard } from '../../core/guards/redirect-if-auth.guard';

export const authRoutes : Routes = [
  { path: 'login',
  loadComponent: () =>
  import('./login/login.component').then(m => m.LoginComponent),
  canActivate: [RedirectIfAuthenticatedGuard]
},
{
  path: 'register',
    loadComponent: () =>
  import('./register/register.component').then(m => m.RegisterComponent),
  canActivate: [RedirectIfAuthenticatedGuard]
}
//  ajouter d'autres routes ici plus tard

];
