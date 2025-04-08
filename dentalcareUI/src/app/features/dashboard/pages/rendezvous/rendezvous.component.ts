import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { RendezVousResponse } from '../../models/rendezvous-response.model';

import { FullCalendarModule } from '@fullcalendar/angular'; // wrapper Angular
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FullCalendarModule
  ],
  templateUrl: './rendezvous.component.html',
  styleUrls: ['./rendezvous.component.css'],
  animations: [
    trigger('fadeList', [
      transition(':enter', [
        query('.rdv-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class RendezvousComponent implements OnInit {
  rendezvousList: RendezVousResponse[] = [];
  loading = true;
  error: string | null = null;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: false,
    editable: false,
    events: []
  };

  constructor(private rendezvousService: RendezvousService) {}

  ngOnInit(): void {
    this.fetchRendezVous();
  }

  /** 🔄 Appel API pour charger les rendez-vous */
  fetchRendezVous(): void {
    this.loading = true;
    this.rendezvousService.getAll().subscribe({
      next: (data) => {
        this.rendezvousList = data;
        this.calendarOptions.events = this.mapToCalendarEvents(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger les rendez-vous.";
        console.error("Erreur lors du chargement :", err);
        this.loading = false;
      }
    });
  }

  /** ✅ Transforme la liste des RDV en événements FullCalendar */
  private mapToCalendarEvents(rdvList: RendezVousResponse[]) {
    return rdvList.map(rdv => ({
      title: `${rdv.patientFullName} (${rdv.status})`,
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: this.getStatusColor(rdv.status)
    }));
  }

  /** 🎨 Couleurs selon le statut du RDV */
  private getStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRME': return '#4CAF50'; // Vert
      case 'EN_ATTENTE': return '#FF9800'; // Orange
      case 'ANNULE': return '#F44336'; // Rouge
      default: return '#2196F3'; // Bleu
    }
  }

  /** 🗑️ Supprimer un RDV */
  deleteRdv(id: number): void {
    if (confirm("Supprimer ce rendez-vous ?")) {
      this.rendezvousService.deleteById(id).subscribe({
        next: () => {
          this.rendezvousList = this.rendezvousList.filter(rdv => rdv.id !== id);
          this.calendarOptions.events = this.mapToCalendarEvents(this.rendezvousList);
        },
        error: (err) => {
          alert("Erreur lors de la suppression.");
          console.error(err);
        }
      });
    }
  }
}
