// src/app/features/auth/activate-account/activate-account.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activate-account.component.html',
})
export class ActivateAccountComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  token: string = '';
  message: string = '';
  isError = false;
  isLoading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('🧪 Params reçus :', params);
      if (params['token']) {
        this.token = params['token'];
        this.activate();
      }
    });
  }

  activate(): void {
    if (!this.token || this.token.length !== 6) {
      this.message = '❌ Code invalide.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.authService.activateAccount(this.token).subscribe({
      next: () => {
        this.isLoading = false;
        this.isError = false;
        this.message = '✅ Compte activé avec succès. Redirection...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message =
          err.error?.message || '❌ Code invalide ou expiré. Réessayez.';
      },
    });
  }
}
