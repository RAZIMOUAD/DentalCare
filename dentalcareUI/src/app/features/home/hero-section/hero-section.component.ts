import { AfterViewInit, Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll(
      '.fade-in-up, .animate-on-scroll'
    );

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // stop observing after animation
          }
        });
      },
      {
        threshold: 0.15 // déclenche à 15% visible pour équilibre mobile / desktop
      }
    );

    elements.forEach((el: Element) => observer.observe(el));
  }
}
