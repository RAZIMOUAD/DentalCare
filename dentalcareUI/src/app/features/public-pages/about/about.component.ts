import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  facts = [
    { value: '120', label: 'Health Sections', img: 'assets/images/img1.png' },
    { value: '234', label: 'Professionals Doctor', img: 'assets/images/img2.png' },
    { value: '2234', label: 'Satisfied Patients', img: 'assets/images/img3.png' },
    { value: '100+', label: 'Health Plans', img: 'assets/images/img4.png' }
  ];

  features = [
    {
      icon: 'check-circle',
      title: 'Matériel de dernière génération'
    },
    {
      icon: 'user-group',
      title: 'Équipe passionnée et expérimentée'
    },
    {
      icon: 'sparkles',
      title: 'Soin personnalisé pour chaque patient'
    },
    {
      icon: 'shield-check',
      title: 'Hygiène & sécurité renforcées'
    }
  ];
}
