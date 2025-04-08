import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-stats',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './card-stats.component.html',
  styleUrl: './card-stats.component.css'
})
export class CardStatsComponent {
  /**
   * Le titre de la statistique (ex : "Patients", "Rendez-vous", "Revenus")
   */
  @Input() title: string = '';

  /**
   * La valeur affichée (ex : 245, "1240 €", etc.)
   */
  @Input() value: string | number = '';


  /**
   * Une icône (emoji ou classe CSS ou SVG future)
   */
  @Input() icon: string = '';

  /**
   * Couleur de fond du badge ou de l’icône (facultatif)
   */
  @Input() color: string = 'bg-blue-100 text-blue-700';
}
