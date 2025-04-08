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
  /** Événement déclenché lors de la soumission */
  @Output() createAppointment = new EventEmitter<{
    patientName: string;
    startTime: string;
    endTime: string;
  }>();

  /** Événement déclenché lorsqu'on ferme la modale */
  @Output() closeModal = new EventEmitter<void>();

  submit(): void {
    if (this.patientName && this.startTime && this.endTime) {
      this.createAppointment.emit({
        patientName: this.patientName,
        startTime: this.startTime,
        endTime: this.endTime
      });
    }
  }

  close(): void {
    this.closeModal.emit();
  }
}
