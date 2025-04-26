import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { LucideIconsModule} from '@shared/modules/lucide-icons.module';
import { NgForOf, NgClass } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-testimonials-section',
  standalone: true,
  templateUrl: './testimonials-section.component.html',
  styleUrls: ['./testimonials-section.component.css'],
  imports: [LucideIconsModule, NgClass, NgForOf,NgOptimizedImage ]
})
export class TestimonialsSectionComponent implements OnInit, AfterViewInit {
  testimonials = [
    {
      name: 'Sophie Martin',
      comment: 'Une équipe formidable, un accueil chaleureux et des soins impeccables. Merci DentalCare !',
      rating: 5,
      photo: 'assets/images/review-2.jpg'
    },
    {
      name: 'Ali Ben Omar',
      comment: 'Professionnalisme et douceur. Je recommande vivement à tous ceux qui cherchent un cabinet sérieux.',
      rating: 4,
      photo: 'assets/images/review-4.jpg'
    },
    {
      name: 'Claire Dupont',
      comment: 'Des locaux magnifiques, des explications claires, et une équipe toujours souriante.',
      rating: 5,
      photo: 'assets/images/review-6.jpg'
    }
  ];

  currentIndex = 0;
  intervalId: any;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.startAutoSlide();
  }

  get currentTransform(): string {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }, 5000); // Slide toutes les 5 secondes
  }

  ngAfterViewInit(): void {
    const elements = this.el.nativeElement.querySelectorAll('.animate-fade-in-up');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach((el: Element) => observer.observe(el));
  }
}
