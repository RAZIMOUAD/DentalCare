import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string = "khalil";
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  ngOnInit(): void {
    const navbar = document.querySelector('.navbar-area');

    window.onscroll = () => {
      if (window.scrollY >= 20) {
        navbar?.classList.add('sticky');
      } else {
        navbar?.classList.remove('sticky');
      }
    };
  }
}
