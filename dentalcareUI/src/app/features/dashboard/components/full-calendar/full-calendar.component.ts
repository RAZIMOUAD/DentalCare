import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // wrapper officiel Angular
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // pour clics et drag
import { CalendarOptions, EventClickArg, DateSelectArg, EventInput} from '@fullcalendar/core';
import { CalendarModalComponent } from '../calendar-modal/calendar-modal.component';
import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { RendezVousResponse } from '../../models/rendezvous-response.model';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
@Component({
  selector: 'app-full-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CalendarModalComponent, LucideIconsModule],
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent implements OnInit {
  showModal: boolean = false;
  patientName: string = '';
  startTime: string = '';
  endTime: string = '';
  motif: string = '';
  type: string = 'CONSULTATION';
  praticien: string = 'Dr. Zahra';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    editable: true,
    nowIndicator: true,
    weekends: true,
    allDaySlot: false,
    events: [],
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventChange.bind(this),
    eventResize: this.handleEventChange.bind(this)
  };
  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.rendezvousService.getByDate(today).subscribe({
      next: (rdvs) => {
        this.calendarOptions.events = this.mapToEvents(rdvs);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des RDV :', err);
      },
    });
  }
  private mapToEvents(rdvs: RendezVousResponse[]): EventInput[] {
    return rdvs.map((rdv) => ({
      title: `${rdv.patientFullName} (${rdv.status})`,
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: this.getColorByStatus(rdv.status)
    }));
  }
  private getColorByStatus(status: string): string {
    switch (status) {
      case 'CONFIRME': return 'green';
      case 'ANNULE': return 'red';
      case 'EN_ATTENTE':
      default: return 'orange';
    }
  }
  /**
   * Lorsqu'on sélectionne un créneau (clic-glisser ou clic sur jour)
   */
  handleDateSelect(selectInfo: DateSelectArg): void {
    this.startTime = selectInfo.startStr;
    this.endTime = selectInfo.endStr;
    this.showModal = true;

// 🔁 Appeler backend plus tard pour persister

  }
// 🔁 Appeler backend plus tard pour persister
  onAppointmentCreated(event: {
    patientName: string;
    startTime: string;
    endTime: string;
    motif: string;
    type: string;
    praticien: string;
  }): void {
    const calendarApi = (document.querySelector('full-calendar') as any)?.getApi();
    if (calendarApi) {
      calendarApi.addEvent({
        title: `${event.patientName} (${event.type})`,
        start: event.startTime,
        end: event.endTime,
        allDay: false,
        color: 'orange'
      });
    }
    this.resetModal();
  }
  /**
   * Lorsqu'on clique sur un événement existant
   */
  handleEventClick(clickInfo: EventClickArg): void {
    if (confirm(`Supprimer le rendez-vous : "${clickInfo.event.title}" ?`)) {
      clickInfo.event.remove();
      // 🔁 Appeler backend pour suppression réelle plus tard
    }
  }

  /**
   * Lorsqu'on modifie un événement (drag or resize)
   */
  handleEventChange(changeInfo: any): void {
    console.log('Événement modifié :', changeInfo.event);
    // 🔁 Appeler backend pour mise à jour
  }

  closeModal(): void {
    this.resetModal();
  }
  private resetModal(): void {
    this.showModal = false;
    this.patientName = '';
    this.startTime = '';
    this.endTime = '';
    this.motif = '';
    this.type = 'CONSULTATION';
    this.praticien = 'Dr. Zahra';
  }
}
