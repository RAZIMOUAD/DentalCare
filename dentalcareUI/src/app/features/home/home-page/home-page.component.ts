import { Component } from '@angular/core';
import { HeroSectionComponent } from '../hero-section/hero-section.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
  imports: [HeroSectionComponent]

})
export class HomePageComponent {}
