// src/app/public-pages/calendar-public/calendar-public.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { RendezvousService} from '../../../core/services/rendezvous.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-calendar-public',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    FormsModule,
    LucideIconsModule, // ✅ pick directement ici !
  ],
  templateUrl: './calendar-public.component.html',
  styleUrls: ['./calendar-public.component.css']
})
export class CalendarPublicComponent implements OnInit {

  private rendezvousService = inject(RendezvousService);


  isAuthenticated = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: frLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    selectable: true,
    editable: false,
    height: 'auto',
    dayMaxEventRows: true,
    weekends: true,
    events: [], // 🟡 Remplissage dynamique prévu après intégration backend
    eventColor: '#2563eb',
    eventDisplay: 'block',
    eventClick: this.onEventClick.bind(this),
    dateClick: this.onDateClick.bind(this),
  };

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadDisponibilites(); // ⏳ Prévu pour version dynamique
  }

  /** ✅ Vérifie la présence d'un token pour l’authentification */
  checkAuthentication(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
  }

  /** 📥 Charge dynamiquement les rendez-vous depuis le backend */
  loadDisponibilites(): void {
    this.rendezvousService.getAll().subscribe({
      next: (events) => {
        this.calendarOptions.events = events.map((event: any) => ({
          title: event.titre || 'Disponible',
          date: event.date,
          color: event.reserve ? '#9ca3af' : '#2563eb',
          allDay: true
        }));
      },
      error: () => {
        console.error('❌ Erreur lors du chargement des disponibilités.');
      }
    });
  }


  /** 🎯 Réagit au clic sur un événement existant */
  onEventClick(info: any): void {
    const titre = info.event.title;
    const date = info.event.startStr;

    if (info.event.backgroundColor === '#9ca3af') {
      alert(`⛔ Ce créneau est déjà réservé.\nDate : ${date}`);
      return;
    }

    if (!this.isAuthenticated) {
      alert('Veuillez vous connecter pour réserver ce créneau.');
    } else {
      alert(`📅 Vous avez sélectionné : ${titre}\nDate : ${date}`);
    }
  }

  /** ➕ Réagit au clic sur une case de date vide */
  onDateClick(info: any): void {
    if (!this.isAuthenticated) {
      alert('Veuillez vous connecter pour réserver à cette date.');
      return;
    }

    console.log('📅 Date sélectionnée (créneau libre) :', info.dateStr);
    // 🔜 Afficher ici un formulaire/modal si connecté
  }
}
