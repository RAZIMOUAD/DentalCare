import { Routes } from '@angular/router';
import { AuthGuardAdmin } from '../../core/guards/auth-admin.guard';
import { DashboardComponent} from './dashboard.component';
import { RendezvousComponent } from './pages/rendezvous/rendezvous.component';
export const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuardAdmin],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'accueil' // ✅ Redirection vers accueil
      },
      {
        path: 'accueil',
        loadComponent: () =>
          import('./pages/accueil/accueil.component').then(m => m.AccueilComponent)
      },
      {
        path: 'calendrier',
        loadComponent: () =>
          import('./components/full-calendar/full-calendar.component').then(m => m.FullCalendarComponent)
      },
      {
        path: 'rendezvous',
        component: RendezvousComponent // ✅ Ici on lie la route à notre composant
      }
      // 🔁 Tu pourras ajouter ici `rendez-vous`, `patients`, `paramètres`, etc.
    ]
  }
];
