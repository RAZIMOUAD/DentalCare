import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { PatientService, PatientResponse } from '../../../../../core/services/patient.service';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-patients-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideIconsModule
  ],
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit {
  patients: PatientResponse[] = [];
  isLoading = true;
  hasError = false;
  totalPatients = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  filters = {
    nom: '',
    createdByAdmin: undefined as boolean | undefined,
    enabled: undefined as boolean | undefined
  };

  ngOnInit(): void {
    this.loadPatients();
  }

  /**
   * ✏️ Navigue vers le formulaire d’édition
   */
  onEdit(id: number): void {
    this.router.navigate(['edit', id]);
  }

  /**
   * 👁️ Navigue vers la fiche détaillée du patient
   */
  onView(id: number): void {
    this.router.navigate([id.toString()]);
  }

  /**
   * 🗑️ Suppression (à implémenter proprement plus tard)
   */
  onDelete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce patient ?')) {
      // TODO: Appeler le service de suppression + refresh
      console.log('Suppression simulée du patient ID :', id);
    }
  }

  /**
   * 🧠 Optimisation de l’affichage
   */
  trackById(index: number, patient: PatientResponse): number {
    return patient.id;
  }
  /**
   * 🔄 Charge tous les patients paginées depuis le backend
   */
  loadPatients(): void {
    this.isLoading = true;

    this.patientService.getPaginatedPatients(this.currentPage, this.pageSize, this.filters)
      .pipe(
        catchError(err => {
          console.error('❌ Erreur chargement patients :', err);
          this.patients = [];
          return of({ content: [], totalElements: 0, number: 0, size: 10, totalPages: 0 });
        })
      )
      .subscribe(res => {
        this.patients = res.content;
        this.totalPatients = res.totalElements;
        this.currentPage = res.number;
        this.pageSize = res.size;
        this.isLoading = false;
      });
  }

}
