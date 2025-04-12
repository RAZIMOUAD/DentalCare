// src/app/public-pages/calendar-public/calendar-public.component.ts

import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { RendezvousService} from '../../../core/services/rendezvous.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { AUTH_TOKEN_KEY } from '../../../core/constants/storage-keys';


@Component({
  selector: 'app-calendar-public',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FullCalendarModule,
    FormsModule,
    LucideIconsModule, // ✅ pick directement ici !
  ],
  templateUrl: './calendar-public.component.html',
  styleUrls: ['./calendar-public.component.css']
})
export class CalendarPublicComponent implements OnInit {

  private rendezvousService = inject(RendezvousService);
  @ViewChild('calendarRef') calendarComponent!: FullCalendarComponent;

  isAuthenticated = false;
  appointmentType = 'Tout afficher';
  selectedDoctor = '';
  selectedMonth = '';// ex: '2024-06'

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

    // Nouvelle ligne → on initialise selectedMonth au mois courant
    const today = new Date();
    this.selectedMonth = today.toISOString().slice(0, 7); // '2025-05'

    this.applyFilters(); // 👈 Appelle automatiquement loadDisponibilites() et updateCalendarView()
  }


  /** ✅ Vérifie la présence d'un token pour l’authentification */
  checkAuthentication(): void {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      this.isAuthenticated = false;
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      this.isAuthenticated = payload.exp && payload.exp > now;
    } catch (e) {
      this.isAuthenticated = false;
    }
  }


  /** 📥 Charge dynamiquement les rendez-vous depuis le backend */
  loadDisponibilites(): void {
    if (!this.selectedMonth) return;

    // Format attendu : 'YYYY-MM-DD'
    const selectedDate = `${this.selectedMonth}-01`;

    this.rendezvousService.getByMonthDate(selectedDate).subscribe({
      next: (events) => {
        const filtered = events.filter((event: any) => {
          const matchType = this.appointmentType === 'Tout afficher' || event.type === this.appointmentType;
          const matchPraticien = !this.selectedDoctor || event.praticien === this.selectedDoctor;
          return matchType && matchPraticien;
        });

        this.calendarOptions.events = filtered.map((event: any) => ({
          title: event.titre || 'Disponible',
          date: event.date,
          color: event.reserve ? '#9ca3af' : '#2563eb',
        }));
      },
      error: () => {
        console.error('❌ Erreur lors du chargement des disponibilités du mois.');
      },
    });
  }

  updateCalendarView(): void {
    if (this.selectedMonth) {
      const calendarApi = this.calendarComponent.getApi();
      // 👇 On force le calendrier à se positionner sur le mois sélectionné
      calendarApi.gotoDate(`${this.selectedMonth}-01`);
    }
  }

  applyFilters(): void {
    this.updateCalendarView();// force la vue sur le mois choisi
    this.loadDisponibilites();// maintenant appelle getByMonthDate()
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
