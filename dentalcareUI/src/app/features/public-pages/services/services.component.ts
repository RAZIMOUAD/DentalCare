import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-services',
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services = [
    {
      title: 'General Dentistry',
      img: 'assets/images/services-1.jpg'
    },
    {
      title: 'Cosmetic Dentistry',
      img: 'assets/images/services-2.jpg'
    },
    {
      title: 'Dental Implants',
      img: 'assets/images/services-3.jpg'
    },
    {
      title: 'Orthodontics',
      img: 'assets/images/services-4.jpg'
    },
    {
      title: 'Teeth Whitening',
      img: 'assets/images/services-5.jpg'
    },
    {
      title: 'Teeth Cleaning',
      img: 'assets/images/services-6.jpg'
    }
  ];
}
