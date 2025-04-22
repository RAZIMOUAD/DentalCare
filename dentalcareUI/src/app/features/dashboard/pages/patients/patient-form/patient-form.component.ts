import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PatientService } from '../../../../../core/services/patient.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideIconsModule
  ],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css']
})
export class PatientFormComponent implements OnInit {
  patientForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  @Output() created = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cin: ['', Validators.required],
      genre: [''],
      dateNaissance: [''],
      adresse: [''],
      enabled: [true]
    });
  }

  /**
   * 🔼 Soumet le formulaire si valide et envoie les données au backend
   */
  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = this.patientForm.value;

    this.patientService.createPatient(payload).subscribe({
      next: (createdPatient) => {
        this.successMessage = `✅ Patient ${createdPatient.prenom} ${createdPatient.nom} ajouté avec succès.`;
        this.isSubmitting = false;

        // 🔁 Notifie le composant parent pour rafraîchir la liste
        this.created.emit();

        // Optionnel : réinitialise le formulaire
        this.patientForm.reset({
          nom: '',
          prenom: '',
          email: '',
          cin: '',
          genre: '',
          dateNaissance: '',
          adresse: '',
          enabled: true
        });
      },
      error: (error) => {
        this.errorMessage = '❌ Une erreur est survenue lors de la création du patient.';
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }
}
