// src/app/features/user-account/appointments/booking/booking.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

import { WebSocketService } from '../../../../core/services/websocket.service';
import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { RdvUtilsService } from '../../../../core/services/rdv-utils.service';
import { ToastService } from '../../../../core/services/toast.service';

import { RendezVousRequest } from '../../../dashboard/models/rendezvous-request.model';
import { ReservedSlot } from '../../../../core/services/rdv-utils.service';
import { AppointmentsTableComponent } from '../../components/appointments-table/appointments-table.component';
import { AppointmentFormComponent } from '../../components/appointment-form/appointment-form.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    AppointmentFormComponent,
    AppointmentsTableComponent
  ]
})
export class BookingComponent implements OnInit {
  private rdvService = inject(RendezvousService);
  private websocketService = inject(WebSocketService);
  private utils = inject(RdvUtilsService);
  private toast = inject(ToastService);

  calendarOptions!: CalendarOptions;
  selectedDate: string = '';
  heureDebut: string = '';
  heureFin: string = '';
  selectedType: string = '';
  showForm = false;
  showTable = true;

  typeOptions: string[] = ['CONSULTATION', 'DETARTRAGE', 'URGENCE'];
  reservedSlots: ReservedSlot[] = [];

  ngOnInit(): void {
    this.initializeCalendar();
    this.loadRendezVous();

    this.websocketService.connect();
    this.websocketService.newRdv$.subscribe(() => this.loadRendezVous());
    this.websocketService.confirmedRdv$.subscribe(() => this.loadRendezVous());
    this.websocketService.rejectedRdv$.subscribe(() => this.loadRendezVous());
  }

  initializeCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      selectable: true,
      events: [],
      dateClick: this.handleDateClick.bind(this),
      datesSet: (arg) => {
        const year = arg.start.getFullYear();
        const month = arg.start.getMonth() + 1;
        this.loadRendezVousByMonth(year, month);
      },
    };
  }

  loadRendezVous(): void {
    this.rdvService.getAll().subscribe(data => {
      this.reservedSlots = data;
      this.calendarOptions.events = this.mapToCalendarEvents(data);
    });
  }

  loadRendezVousByMonth(year: number, month: number): void {
    this.rdvService.getByMonth(year, month).subscribe(data => {
      this.reservedSlots = data;
      this.calendarOptions.events = this.mapToCalendarEvents(data);
    });
  }

  mapToCalendarEvents(data: ReservedSlot[]) {
    return data.map(rdv => ({
      title: 'Réservé',
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: '#ef4444'
    }));
  }

  handleDateClick(arg: any): void {
    this.selectedDate = arg.dateStr;
    this.heureDebut = '';
    this.heureFin = '';
    this.showForm = true;
  }

  getAvailableSlots(): string[] {
    return this.utils.getAvailableSlots(this.selectedDate, this.reservedSlots);
  }

  onSlotSelected(slotString: string): void {
    const [start, end] = slotString.split(' - ');
    this.heureDebut = start;
    this.heureFin = end;
  }

  validerRDV(request: RendezVousRequest): void {
    if (!request) return;

    this.rdvService.createRendezVous(request).subscribe({
      next: () => {
        this.toast.success('✅ Rendez-vous confirmé avec succès.');
        this.showForm = false;
        this.loadRendezVous();
      },
      error: (err) => {
        const msg = err?.error?.message || '❌ Une erreur est survenue.';
        this.toast.error(msg);
      }
    });
  }

  annulerRDV(): void {
    this.showForm = false;
    this.selectedDate = '';
    this.heureDebut = '';
    this.heureFin = '';
    this.selectedType = '';
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
  }
}
