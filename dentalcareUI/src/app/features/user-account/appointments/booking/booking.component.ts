import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RendezvousService } from '/Users/macm2/DentalCare/dentalcareUI/src/app/core/services/rendezvous.service';
import { RendezVousRequest } from '/Users/macm2/DentalCare/dentalcareUI/src/app/features/dashboard/models/rendezvous-request.model';
import {FullCalendarModule} from '@fullcalendar/angular';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [
    FullCalendarModule
  ]
})
export class BookingComponent implements OnInit {
  calendarOptions: CalendarOptions;
  selectedDate: string = '';
  heureDebut: string = '';
  heureFin: string = '';
  showForm = false;

  reservedSlots: { date: string; heureDebut: string; heureFin: string }[] = [];

  constructor(private rdvService: RendezvousService) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: [],
      dateClick: this.handleDateClick.bind(this),
    };
  }

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    this.rdvService.getByMonth(year, month).subscribe(data => {
      this.reservedSlots = data;
      this.calendarOptions.events = data.map(rdv => ({
        title: 'Réservé',
        start: `${rdv.date}T${rdv.heureDebut}`,
        end: `${rdv.date}T${rdv.heureFin}`,
        color: '#ff6666'
      }));
    });
  }

  handleDateClick(arg: any) {
    this.selectedDate = arg.dateStr;
    this.showForm = true;
    this.heureDebut = '';
    this.heureFin = '';
  }

  getAvailableSlots(): string[] {
    const slots: string[] = [];
    let time = new Date(`2000-01-01T09:00`);
    const end = new Date(`2000-01-01T18:00`);

    while (time < end) {
      const start = time.toTimeString().substring(0, 5);
      const next = new Date(time.getTime() + 30 * 60 * 1000);
      const endStr = next.toTimeString().substring(0, 5);

      const isReserved = this.reservedSlots.some(r =>
        r.date === this.selectedDate &&
        r.heureDebut === start &&
        r.heureFin === endStr
      );

      if (!isReserved) {
        slots.push(`${start} - ${endStr}`);
      }
      time = next;
    }

    return slots;
  }

  onSlotSelected(event: any) {
    const [start, end] = event.target.value.split(' - ');
    this.heureDebut = start;
    this.heureFin = end;
  }

  validerRDV() {
    const request: RendezVousRequest = {
      date: this.selectedDate,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin
    };
    this.rdvService.createRendezVous(request).subscribe(() => {
      alert('✅ Rendez-vous confirmé !');
      this.showForm = false;
    });
  }

  annulerRDV() {
    this.showForm = false;
  }
}
