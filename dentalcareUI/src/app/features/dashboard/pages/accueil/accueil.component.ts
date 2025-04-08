import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardStatsComponent } from '../../components/widgets/card-stats/card-stats.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, CardStatsComponent],
  standalone: true,
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit{
  stats: {
    totalPatients: number;
    appointmentsToday: number;
    totalRevenue: number;
  } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/dashboard/stats`).subscribe({
      next: (res: any) => {
        this.stats = res;
      },
      error: (err) => {
        console.error('Erreur chargement stats dashboard', err);
      }
    });
  }
}
