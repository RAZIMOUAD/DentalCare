
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { RendezvousService } from '../../../core/services/rendezvous.service';
import { AuthService } from '../../../core/services/auth.service';
import { RendezVousResponse } from '../../dashboard/models/rendezvous-response.model';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-calendar-public',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FullCalendarModule,
    LucideIconsModule
  ],
  templateUrl: './calendar-public.component.html',
  styleUrls: ['./calendar-public.component.css']
})
export class CalendarPublicComponent implements OnInit {
  private router = inject(Router);
  private rendezvousService = inject(RendezvousService);
  private authService = inject(AuthService);

  @ViewChild('calendarRef') calendarComponent!: FullCalendarComponent;

  isAuthenticated = false;
  appointmentType = 'Tout afficher';
  selectedMonth = ''; // format YYYY-MM

  calendarOptions: CalendarOptions = {
    // ✅ Plugins nécessaires pour la vue mensuelle + interaction
    plugins: [dayGridPlugin, interactionPlugin],

    // ✅ Vue initiale correcte
    initialView: 'dayGridMonth',

    // 🟡 Optionnel, utile si tu veux forcer la vue avec des propriétés personnalisées
    views: {
      dayGridMonth: {
        type: 'dayGridMonth'
      }
    },

    // ✅ Langue
    locale: frLocale,

    // ✅ Toolbar visible
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },

    // ✅ Options de sélection
    selectable: true,
    editable: false,
    height: 'auto',
    dayMaxEventRows: true,
    weekends: true,

    // 🔁 Les événements sont ajoutés dynamiquement
    events: [],

    // ✅ Apparence
    eventColor: '#2563eb',
    eventDisplay: 'block',

    // ✅ Clics sur les événements
    eventClick: this.onEventClick.bind(this),
    dateClick: this.onDateClick.bind(this),

    // ⚠️❗ POINT CRITIQUE : `datesSet` doit **être appelé sans paramètre** ici
    datesSet: () => this.handleMonthChange() // ← CORRECTION ici
  };


  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    const today = new Date();
    this.selectedMonth = this.formatDateToMonthInput(today);
  }

  handleMonthChange(): void {
    const calendarApi = this.calendarComponent.getApi();
    const currentDate = calendarApi.getDate(); // 🧠 Vrai mois visible (celui du titre)

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    setTimeout(() => {
      this.selectedMonth = this.formatDateToMonthInput(currentDate);
    }, 0);

    this.loadDisponibilites(year, month);
  }



  onMonthInputChange(event: any): void {
    const value = event.target.value;
    this.selectedMonth = value;
    const [year, month] = value.split('-').map(Number);
    this.calendarComponent.getApi().gotoDate(`${year}-${month.toString().padStart(2, '0')}-01`);
  }

  applyFilters(): void {
    const current = this.calendarComponent.getApi().getDate();
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    this.loadDisponibilites(year, month);
  }
  private fetchRendezVousByMonth(year: number, month: number): Observable<RendezVousResponse[]> {
    return this.rendezvousService.getPublicByMonth(year, month);
  }

  loadDisponibilites(year: number, month: number): void {
    this.fetchRendezVousByMonth(year, month).subscribe({
      next: (rdvs) => {
        const filtered = this.filterAppointmentsByType(rdvs);
        this.renderAppointmentsToCalendar(filtered);
      },
      error: () => {
        console.error('❌ Erreur lors du chargement des RDV.');
      }
    });
  }
  private filterAppointmentsByType(rdvs: RendezVousResponse[]): RendezVousResponse[] {
    return rdvs.filter(rdv => rdv.status === 'CONFIRME');
  }

  private renderAppointmentsToCalendar(rdvs: RendezVousResponse[]): void {
    const events = rdvs.map((rdv) => ({
      id: rdv.id.toString(),
      title: `${rdv.heureDebut.slice(0, 5)} ${rdv.type}`,
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: '#2563eb' // couleur unique ici
    }));

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    events.forEach(e => calendarApi.addEvent(e));
  }



  onEventClick(info: any): void {
    const title = info.event.title;
    const date = info.event.startStr;

    if (info.event.backgroundColor === '#9ca3af') {
      alert(`⛔ Ce créneau est déjà réservé.\nDate : ${date}`);
      return;
    }

    if (!this.isAuthenticated) {
      alert('Veuillez vous connecter pour réserver ce créneau.');
    } else {
      alert(`📅 Vous avez sélectionné : ${title}\nDate : ${date}`);
    }
  }

  onDateClick(info: any): void {
    if (!this.isAuthenticated) {
      alert('Veuillez vous connecter pour réserver à cette date.');
      return;
    }

    const date = info.dateStr;
    this.router.navigate(['/user/reserver'], { queryParams: { date } });
  }

  onStartReservation(): void {
    this.router.navigate(['/user/reserver']).then(success => {
      if (!success) {
        console.warn('⚠️ La redirection a échoué.');
      }
    });
  }

  private formatDateToMonthInput(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }
}
