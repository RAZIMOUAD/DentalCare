import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.css']
})
export class CalendarModalComponent {

  /** Nom du patient saisi dans le formulaire */
  @Input() patientName: string = '';
  @Output() patientNameChange = new EventEmitter<string>();
  /** Date et heure de début */
  @Input() startTime: string = '';
  @Output() startTimeChange = new EventEmitter<string>();
  /** Date et heure de fin */
  @Input() endTime: string = '';
  @Output() endTimeChange = new EventEmitter<string>();

  /** 🗨️ Motif du rendez-vous */
  @Input() motif: string = '';
  @Output() motifChange = new EventEmitter<string>();
  /** 🦷 Type de rendez-vous */
  @Input() type: string = 'CONSULTATION';
  @Output() typeChange = new EventEmitter<string>();

  /** 👨‍⚕️ Praticien assigné */
  @Input() praticien: string = 'Dr. Zahra';
  @Output() praticienChange = new EventEmitter<string>();


  /** 📤 Soumission du formulaire */
  @Output() createAppointment = new EventEmitter<{
    patientName: string;
    startTime: string;
    endTime: string;
    motif: string;
    type: string;
    praticien: string;
  }>();

  /** Événement déclenché lorsqu'on ferme la modale */
  @Output() closeModal = new EventEmitter<void>();

  submit(): void {
    if (this.patientName && this.startTime && this.endTime && this.motif && this.type && this.praticien) {
      this.createAppointment.emit({
        patientName: this.patientName,
        startTime: this.startTime,
        endTime: this.endTime,
        motif: this.motif,
        type: this.type,
        praticien: this.praticien
      });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
