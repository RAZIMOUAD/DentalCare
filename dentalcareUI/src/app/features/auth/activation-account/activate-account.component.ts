// src/app/features/auth/activate-account/activate-account.component.ts

import { Component, inject, OnInit, signal } from '@angular/core';
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
      const receivedToken = params['token'];
      if (receivedToken) {
        this.token = receivedToken;
        this.activate();
      } else {
        this.message = '❌ Aucun code d’activation fourni.';
        this.isError = true;
      }
    });
  }

  activate(): void {
    if (!/^\d{6}$/.test(this.token)) {
      this.message = '❌ Code invalide. Le code doit contenir 6 chiffres.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.authService.activateAccount(this.token).subscribe({
      next: () => {
        this.isLoading = false;
        this.isError = false;
        this.message = '✅ Compte activé avec succès. Redirection en cours...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message =
          err?.error?.message?.includes('expired')
            ? '⏳ Code expiré. Un nouveau code vous a été renvoyé par email.'
            : '❌ Code invalide ou déjà utilisé.';
      },
    });
  }
}
