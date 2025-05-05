import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RendezvousService } from '../../../../core/services/rendezvous.service';
import { RendezVousResponse } from '../../models/rendezvous-response.model';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';
import { FullCalendarModule } from '@fullcalendar/angular'; // wrapper Angular
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@shared/services/notification.service';
import {ConfirmationDialogComponent} from '../../components/confirmation-dialog/confirmation-dialog.component';
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
    FullCalendarModule, LucideIconsModule
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
export class RendezvousComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  rendezvousList: RendezVousResponse[] = [];
  loading = true;
  error: string | null = null;
 // selectedEvent: any = null; a utiliser si nécessaire
  // Configuration améliorée du calendrier
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
    locale: 'fr',
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: this.handleEventMount.bind(this),
    events: (fetchInfo, successCallback, failureCallback) => {
      this.rendezvousService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          this.rendezvousList = data;
          const events = this.mapToCalendarEvents(data);
          successCallback(events);
        },
        error: (err) => {
          this.error = "Impossible de charger les rendez-vous.";
          this.notificationService.showError("Erreur lors du chargement des rendez-vous");
          console.error("Erreur lors du chargement :", err);
          failureCallback(err);
        }
      });
    }
  };

  constructor(private rendezvousService: RendezvousService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.fetchRendezVous();
    // Rafraîchissement automatique toutes les 5 minutes
    this.setupAutoRefresh();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /** 🔄 Configuration du rafraîchissement automatique */
  private setupAutoRefresh(): void {
    setInterval(() => {
      if (!this.loading) {
        this.fetchRendezVous();
      }
    }, 300000); // 5 minutes
  }

  /** 🔄 Appel API pour charger les rendez-vous */
  fetchRendezVous(): void {
    this.loading = true;
    this.rendezvousService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.rendezvousList = data;
        this.calendarOptions.events = this.mapToCalendarEvents(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = "Impossible de charger les rendez-vous.";
        this.notificationService.showError("Erreur lors du chargement des rendez-vous");
        console.error("Erreur lors du chargement :", err);
        this.loading = false;
      }
    });
  }

  /** ✅ Transforme la liste des RDV en événements FullCalendar */
  private mapToCalendarEvents(rdvList: RendezVousResponse[]) {
    return rdvList.map(rdv => ({
      id: rdv.id.toString(),
      title: `${rdv.nomPatient} (${rdv.status})`,
      start: `${rdv.date}T${rdv.heureDebut}`,
      end: `${rdv.date}T${rdv.heureFin}`,
      color: this.getStatusColor(rdv.status),
      extendedProps: {
        nomPatient: rdv.nomPatient,
        status: rdv.status,
        type: rdv.type || ''
      }
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
  /** 🖱️ Gestion du clic sur un événement */
  private handleEventClick(info: EventClickArg): void {
    const rdv: RendezVousResponse = info.event.extendedProps as RendezVousResponse;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Détails du rendez-vous',
        message: `Patient: ${rdv.nomPatient}\nStatut: ${rdv.status}`,
        confirmText: 'Confirmer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmRdv(Number(info.event.id));
      }
    });
  }

  /** 🎨 Personnalisation de l'apparence des événements */
  private handleEventMount(info: any): void {
    const status: string = info.event.extendedProps.status?.toLowerCase();

    // 🧠 Normalise les accents et majuscules pour correspondre au CSS
    const normalizedStatus = status
      .normalize("NFD") //   ✅ Convertit les caractères accentués
      .replace(/[\u0300-\u036f]/g, "")  // ✅ Supprime les accents (é → e)
      .replace(/\s+/g, "_");// ✅ Remplace les espaces (si "en attente" → en_attente)

    const tooltip = document.createElement('div');
    tooltip.className = 'event-tooltip';
    tooltip.innerHTML = `
      <strong>${info.event.title}</strong><br>
      <small>${info.event.extendedProps.description}</small>
    `;
    info.el.appendChild(tooltip);
    // ✅ Ajout de la classe CSS personnalisée
    info.el.classList.add(`fc-status-${normalizedStatus}`);
  }

  /** ✅ Confirmer un rendez-vous */
  confirmRdv(id: number): void {
    this.rendezvousService.confirmRendezVous(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Rendez-vous confirmé avec succès');
          this.fetchRendezVous();
        },
        error: (err) => {
          this.notificationService.showError('Erreur lors de la confirmation du rendez-vous');
          console.error(err);
        }
      });
  }
  /** ❌ Rejeter un rendez-vous */
  rejectRdv(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Rejeter le rendez-vous',
        message: 'Êtes-vous sûr de vouloir rejeter ce rendez-vous ?',
        confirmText: 'Rejeter',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rendezvousService.rejectRendezVous(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.notificationService.showSuccess('Rendez-vous rejeté avec succès');
              this.fetchRendezVous();
            },
            error: (err) => {
              this.notificationService.showError('Erreur lors du rejet du rendez-vous');
              console.error(err);
            }
          });
      }
    });
  }
  /** 🗑️ Supprimer un RDV */
  deleteRdv(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Supprimer le rendez-vous',
        message: 'Êtes-vous sûr de vouloir supprimer ce rendez-vous ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rendezvousService.deleteById(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.rendezvousList = this.rendezvousList.filter(r => r.id !== id);
              this.calendarOptions.events = this.mapToCalendarEvents(this.rendezvousList);
              this.notificationService.showSuccess('Rendez-vous supprimé avec succès');
            },
            error: (err) => {
              this.notificationService.showError('Erreur lors de la suppression du rendez-vous');
              console.error(err);
            }
          });
      }
    });
  }
}
