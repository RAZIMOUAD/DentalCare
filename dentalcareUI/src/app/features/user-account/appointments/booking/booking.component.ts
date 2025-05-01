import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { RendezvousService } from '/Users/macm2/DentalCare/dentalcareUI/src/app/core/services/rendezvous.service';
import { RendezVousRequest } from '/Users/macm2/DentalCare/dentalcareUI/src/app/features/dashboard/models/rendezvous-request.model';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgIf, NgFor } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { WebSocketService } from '/Users/macm2/DentalCare/dentalcareUI/src/app/core/services/websocket.service';


@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [
    FullCalendarModule,
    NgIf,       // 🔥 pour que *ngIf fonctionne
    NgFor,
    FormsModule,
    // 🔥 pour que *ngFor fonctionne
  ]})
export class BookingComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  selectedDate: string = '';
  heureDebut: string = '';
  heureFin: string = '';
  showForm = false;
  reservedSlots: { date: string; heureDebut: string; heureFin: string }[] = [];
  typeOptions: string[] = ['CONSULTATION', 'DETARTRAGE', 'URGENCE'];
  selectedType: string = '';

  constructor(
    private rdvService: RendezvousService,
    private websocketService: WebSocketService,
  ) {}

  ngOnInit(): void {
    this.reloadCalendarEvents();
    this.websocketService.connect((message) => {
      console.log('📩 Notification WebSocket reçue:', message);
      this.reloadCalendarEvents();
    });
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      events: [],
      selectable: true,
      dateClick: this.handleDateClick.bind(this),
      datesSet: (arg) => {
        const year = arg.start.getFullYear();
        const month = arg.start.getMonth() + 1;
        this.reloadCalendarEventsByMonth(year, month);  // utilise une méthode générique
      }

    };

    this.reloadCalendarEvents();

    // 🛠️ Important : recharger automatiquement quand WebSocket reçoit un message
    this.websocketService.connect((message) => {
      console.log('📩 Notification WebSocket reçue:', message);
      this.reloadCalendarEvents();  // 🔥 recharge l'agenda à chaque notification reçue
    });
  }
  reloadCalendarEventsByMonth(year: number, month: number) {
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

  reloadCalendarEvents() {
    this.rdvService.getAll().subscribe(data => {
      this.reservedSlots = data;

      this.calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        selectable: true,
        dateClick: this.handleDateClick.bind(this),
        datesSet: (arg) => {
          console.log('📅 Mois changé → rechargement inutile, tous les RDV sont déjà affichés.');
        },
        events: data.map(rdv => ({
          title: 'Réservé',
          start: `${rdv.date}T${rdv.heureDebut}`,
          end: `${rdv.date}T${rdv.heureFin}`,
          color: '#ff6666'
        })),
      };
    });
  }



  handleDateClick(arg: any) {
    console.log('✅ Date cliquée :', arg.dateStr);
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
    if (!this.selectedDate || !this.heureDebut || !this.heureFin) {
      alert('🕐 Veuillez sélectionner une date et un créneau horaire pour votre rendez-vous.');
      return;
    }

    // 🔴 Vérifie si la date est un weekend
    const selected = new Date(this.selectedDate);
    const day = selected.getDay(); // 0 = Dimanche, 6 = Samedi
    if (day === 0 || day === 6) {
      alert('📅 Bonjour, notre cabinet est fermé le week-end. Merci de choisir un jour ouvrable.');
      return;
    }

    // 🔴 Vérifie si le créneau est déjà réservé
    const alreadyReserved = this.reservedSlots.some(r =>
      r.date === this.selectedDate &&
      r.heureDebut === this.heureDebut &&
      r.heureFin === this.heureFin
    );
    if (alreadyReserved) {
      alert('⛔ Ce créneau est malheureusement déjà réservé. Merci de choisir un autre horaire disponible.');
      return;
    }
    const request: RendezVousRequest = {
      date: this.selectedDate,
      heureDebut: this.heureDebut,
      heureFin: this.heureFin,
      type: this.selectedType
    };

    this.rdvService.createRendezVous(request).subscribe({
      next: () => {
        alert('✅ Rendez-vous confirmé !');
        this.showForm = false;
        this.reloadCalendarEvents(); // ✅ plus propre
      },
      error: (error) => {
        alert('❌ Erreur : ' + (error?.error?.message || 'Impossible de réserver.'));
      }
    });
  }

  annulerRDV() {
    this.showForm = false;
    this.selectedDate = '';
  }
}
