import {
  Component,
  ViewChild,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input, EventEmitter, Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FullCalendarModule,
  FullCalendarComponent as FCComponent
} from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { RendezVousAdminResponse } from '../../models/rendezvous-admin-response.model';

@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './full-calendar.component.html',
})
export class FullCalendarComponent implements OnInit, OnChanges {
  private rendezvousService = inject(RendezvousService);

  @Input() selectedMonth!: string; // format YYYY-MM
  @Input() refreshTrigger!: number; // 🔁 utilisé pour forcer le rechargement
  @Output() rdvClicked = new EventEmitter<RendezVousAdminResponse>();
  @ViewChild('calendarRef') calendarComponent!: FCComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: frLocale,
    events: [],
    editable: false,
    selectable: false,
    height: 'auto',
    eventDidMount: (info) => {
      info.el.style.cursor = 'pointer'; // ✅ curseur main
    },
    eventClick: this.onEventClick.bind(this),
    datesSet: () => this.loadEvents()
  };

  /** Chargement initial des événements (mois en cours) */
  ngOnInit(): void {
    this.loadEvents();
  }

  /** Synchronisation lors du changement d'@Input() */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] && this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-').map(Number);
      const date = `${year}-${month.toString().padStart(2, '0')}-01`;
      this.calendarComponent?.getApi().gotoDate(date);
      this.loadEvents();
    }
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      console.log('🔁 Rafraîchissement déclenché');
      this.loadEvents();
    }
  }

  /** Chargement des événements pour le mois visible */
  loadEvents(): void {
    const calendarApi = this.calendarComponent?.getApi();
    const currentDate = calendarApi?.getDate() ?? new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    this.rendezvousService.getAllAdminByMonth(year, month).subscribe({
      next: (rdvs: RendezVousAdminResponse[]) => {
        const events = rdvs.map(rdv => ({
          id: rdv.id.toString(),
          title: `${rdv.nomPatient} (${rdv.status})`,
          start: `${rdv.date}T${rdv.heureDebut}`,
          end: `${rdv.date}T${rdv.heureFin}`,
          color: this.getColorByStatus(rdv.status),
          extendedProps: rdv
        }));

        calendarApi?.removeAllEvents();
        events.forEach(event => calendarApi?.addEvent(event));
      },
      error: err => console.error('Erreur lors du chargement des RDV admin', err)
    });
  }
  private onEventClick(info: any): void {
    const rdv = info.event.extendedProps as RendezVousAdminResponse;
    this.rdvClicked.emit(rdv);
  }
  /** Couleurs personnalisées selon le statut du RDV */
  private getColorByStatus(status: string): string {
    switch (status) {
      case 'CONFIRME': return '#4CAF50';     // Vert
      case 'EN_ATTENTE': return '#FFC107';   // Jaune
      case 'ANNULE': return '#F44336';       // Rouge
      default: return '#2196F3';             // Bleu
    }
  }
}
