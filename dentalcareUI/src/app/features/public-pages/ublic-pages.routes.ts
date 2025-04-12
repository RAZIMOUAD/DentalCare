import { Routes } from '@angular/router';


export const PUBLIC_PAGES_ROUTES: Routes = [
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./services/services.component').then(m => m.ServicesComponent)
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./calendar-public/calendar-public.component').then(m => m.CalendarPublicComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then(m => m.ContactComponent)
  }

];
