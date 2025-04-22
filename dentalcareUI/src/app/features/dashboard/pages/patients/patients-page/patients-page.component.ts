import {Component, ViewChild} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideIconsModule} from '@shared/modules/lucide-icons.module';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import {PatientsListComponent} from '../patients-list/patients-list.component';
@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconsModule,PatientFormComponent, PatientsListComponent],
  templateUrl: './patients-page.component.html',
  styleUrls: ['./patients-page.component.css']
})

export class PatientsPageComponent {
  @ViewChild(PatientsListComponent) patientList!: PatientsListComponent;

  constructor(private router: Router) {}
  showForm = false;

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  handlePatientCreated(): void {
    this.showForm = false;
    // 🔄 Recharge la première page pour voir le nouveau patient
    this.patientList.currentPage = 0;
    this.patientList.loadPatients();
  }
  navigateToCreate(): void {
    // TODO: utiliser cette méthode lors de la création en route dédiée

    this.router.navigate(['create'], {
      relativeTo: this.router.routerState.root.firstChild
    }).catch(err => console.error('Navigation échouée :', err));

  }
}
