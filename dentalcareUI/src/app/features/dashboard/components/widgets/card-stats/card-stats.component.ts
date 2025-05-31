import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconsModule } from '@shared/modules/lucide-icons.module';

@Component({
  selector: 'app-card-stats',
  standalone: true,
  imports: [CommonModule, LucideIconsModule],
  templateUrl: './card-stats.component.html',
  styleUrl: './card-stats.component.css'
})
export class CardStatsComponent {
  /**
   * Titre de la statistique (ex: Patients, Revenus)
   */
  @Input() title: string = '';

  /**
   * Valeur affichée (ex: 245 ou "1 240 MAD")
   */
  @Input() value: string | number = '';

  /**
   * Nom de l’icône Lucide (ex: "users", "calendar", "dollar-sign")
   */
  @Input() icon: string = 'activity';

  /**
   * Couleur de l’icône (classe Tailwind, ex: "text-blue-600 bg-blue-100")
   */
  @Input() color: string = 'text-blue-600 bg-blue-100';

  /**
   * Variation (facultatif, ex: "+12%")
   */
  @Input() variation?: string;

  /**
   * Sens de la variation (up/down)
   */
  @Input() variationType: 'up' | 'down' | null = null;
}
