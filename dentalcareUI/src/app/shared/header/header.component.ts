import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  lang: string = 'en';

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
  }

  changeLang(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    localStorage.setItem('lang', value);
    window.location.reload();
  }

}
