// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  // Ajoute d'autres routes ici
];
