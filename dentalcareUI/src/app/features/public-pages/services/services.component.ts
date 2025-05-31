import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-services',
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit {

  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 2;

  serviceCategories = [
    {
      name: 'Dentisterie Générale',
      icon: 'bx-health',
      count: 8
    },
    {
      name: 'Esthétique Dentaire',
      icon: 'bx-smile',
      count: 6
    },
    {
      name: 'Chirurgie Dentaire',
      icon: 'bx-plus-medical',
      count: 4
    },
    {
      name: 'Orthodontie',
      icon: 'bx-grid',
      count: 3
    },
    {
      name: 'Implantologie',
      icon: 'bx-cog',
      count: 5
    },
    {
      name: 'Pédodontie',
      icon: 'bx-child',
      count: 4
    }
  ];

  services = [
    {
      title: 'Dentisterie Générale',
      description: 'Soins dentaires complets incluant examens, nettoyages, obturations et traitements préventifs pour maintenir votre santé bucco-dentaire optimale.',
      image: 'assets/images/services-1.jpg',
      icon: 'bx-health',
      features: [
        'Examens dentaires complets',
        'Nettoyage professionnel',
        'Obturations esthétiques',
        'Traitements préventifs'
      ]
    },
    {
      title: 'Esthétique Dentaire',
      description: 'Transformez votre sourire avec nos traitements esthétiques avancés : blanchiment, facettes, et corrections esthétiques personnalisées.',
      image: 'assets/images/services-2.jpg',
      icon: 'bx-smile',
      features: [
        'Blanchiment dentaire',
        'Facettes en porcelaine',
        'Corrections esthétiques',
        'Smile design numérique'
      ]
    },
    {
      title: 'Implants Dentaires',
      description: 'Solutions permanentes pour remplacer les dents manquantes avec des implants de haute qualité et des techniques chirurgicales avancées.',
      image: 'assets/images/services-3.jpg',
      icon: 'bx-cog',
      features: [
        'Implants titanium premium',
        'Chirurgie guidée par ordinateur',
        'Couronnes sur implants',
        'Restauration complète'
      ]
    },
    {
      title: 'Orthodontie',
      description: 'Correction des malpositions dentaires avec des appareils modernes, invisibles ou traditionnels, adaptés à tous les âges.',
      image: 'assets/images/services-4.jpg',
      icon: 'bx-grid',
      features: [
        'Appareils invisibles Invisalign',
        'Orthodontie traditionnelle',
        'Traitement adolescents/adultes',
        'Suivi personnalisé'
      ]
    },
    {
      title: 'Blanchiment Dentaire',
      description: 'Retrouvez un sourire éclatant avec nos techniques de blanchiment professionnel sûres et efficaces.',
      image: 'assets/images/services-5.jpg',
      icon: 'bx-sun',
      features: [
        'Blanchiment au fauteuil',
        'Gouttières sur mesure',
        'Résultats durables',
        'Technique LED avancée'
      ]
    },
    {
      title: 'Nettoyage Dentaire',
      description: 'Maintenez une hygiène bucco-dentaire parfaite avec nos nettoyages professionnels et nos conseils personnalisés.',
      image: 'assets/images/services-6.jpg',
      icon: 'bx-water',
      features: [
        'Détartrage ultrasonique',
        'Polissage professionnel',
        'Fluorisation',
        'Conseils d\'hygiène'
      ]
    }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Here you would typically fetch new data for the page
      this.scrollToServices();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  private scrollToServices(): void {
    const servicesSection = this.el.nativeElement.querySelector('.services-grid');
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  private initScrollAnimations(): void {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');

          // Add staggered animation for service cards
          if (entry.target.classList.contains('service-card')) {
            const index = Array.from(entry.target.parentElement!.children).indexOf(entry.target);
            (entry.target as HTMLElement).style.animationDelay = `${index * 0.1}s`;
          }
        }
      });
    }, observerOptions);

    // Observe all animatable elements
    const elements = this.el.nativeElement.querySelectorAll(
      '.service-card, .category-card, .service-categories'
    );

    elements.forEach((el: Element) => {
      observer.observe(el);
    });

    // Add initial animation styles
    this.addAnimationStyles();
  }

  private addAnimationStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .service-card, .category-card, .service-categories {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .service-card.animate-in, .category-card.animate-in, .service-categories.animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      .category-card:nth-child(1).animate-in { transition-delay: 0.1s; }
      .category-card:nth-child(2).animate-in { transition-delay: 0.2s; }
      .category-card:nth-child(3).animate-in { transition-delay: 0.3s; }
      .category-card:nth-child(4).animate-in { transition-delay: 0.4s; }
      .category-card:nth-child(5).animate-in { transition-delay: 0.5s; }
      .category-card:nth-child(6).animate-in { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);
  }

  // Service interaction methods
  onServiceHover(service: any): void {
    // Could add analytics tracking or preview functionality
    console.log(`Service hovered: ${service.title}`);
  }

  onCategorySelect(category: any): void {
    // Could filter services by category
    console.log(`Category selected: ${category.name}`);
  }

  // Utility methods
  trackByService(index: number, service: any): any {
    return service.title;
  }

  trackByCategory(index: number, category: any): any {
    return category.name;
  }
}
