// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError  } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import {AUTH_TOKEN_KEY} from '../constants/storage-keys'
// === Interfaces ===
export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
export interface AccountStatusResponse {
  enabled: boolean;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

 export interface DecodedToken {
  sub: string;
  email?: string;
  role?: string;         // Ex: 'ADMIN' ou 'USER'
  roles?: string[];      // Ex: ['ROLE_USER', 'ROLE_ADMIN']
  exp: number;
  iat: number;
}

@Injectable({providedIn: 'root',})
export class AuthService {

  private readonly tokenKey = AUTH_TOKEN_KEY;
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  // code injecté dans loginComponent

  activateAccount(token: string): Observable<void> {
    return this.http.get<void>(`${this.API_URL}/auth/activate-account`, {
      params: { token }
    }).pipe(
      catchError((error) => {
        console.error('❌ Erreur d’activation du compte :', error);
        return throwError(() => error);
      })
    );
  }

  // 🔐 Authentification HTTP
  login(credentials: LoginPayload): Observable<AuthResponse> {
 return this.http.post<AuthResponse>(`${this.API_URL}/auth/authenticate`, credentials);
   }


  handleLoginResponse(response: { token: string }): void {
    try {
      const token = response.token;
      localStorage.setItem(this.tokenKey, token);

      const decoded: DecodedToken = jwtDecode(token);
      console.log('🔐 Token JWT décodé :', decoded);

      const roles = this.extractRoles(decoded);
      this.redirectBasedOnRoles(roles);
    } catch (err) {
      console.error('❌ Erreur lors du traitement du token :', err);
      this.logout(); // Sécurité en cas de token corrompu
    }
  }

// 🔎 Utilitaire : extraire les rôles
  private extractRoles(decoded: DecodedToken): string[] {
    if (decoded.roles) return decoded.roles;
    if (decoded.role) return [decoded.role];
    return [];
  }

// 🧭 Utilitaire : redirection par rôle
  private redirectBasedOnRoles(roles: string[]): void {
    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/dashboard']).then(() =>
        console.log('✅ Redirection vers Dashboard')
      );
    } else if (roles.includes('ROLE_USER')) {
      this.router.navigate(['/user-account/accueil']).then(() =>
        console.log('✅ Redirection vers compte utilisateur')
      );
    } else {
      this.router.navigate(['/']).then(() =>
        console.warn('⚠️ Aucun rôle reconnu. Redirection fallback.')
      );
    }
  }


  // 🛠 Gérer les erreurs de façon centralisée
  getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 401 || error.status === 400) {
      if (typeof error.error === 'string' && error.error.includes('activé')) {
        return '⚠️ Votre compte n’est pas encore activé. Vérifiez votre email.';
      }
      return 'Email ou mot de passe incorrect.';
    }

    if (error.error?.message?.includes('activé')) {
      return '⚠️ Votre compte n’est pas encore activé. Vérifiez votre email.';
    }

    return 'Une erreur est survenue. Veuillez réessayer plus tard.';
  }

// code injecté dans registerComponent
  // 🟢 Inscription
  register(data: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, data);
  }
  // 🚪 Déconnexion
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']).then(success => {
      if (success) {
        console.log('✅ Déconnexion réussie, redirection vers /login');
      } else {
        console.error('❌ Échec de la redirection après déconnexion');
      }
    }).catch(err => {
      console.error('🚨 Erreur inattendue lors de la navigation :', err);
    });
  }


  // 🧠 Décoder le token
  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('❌ Erreur de décodage JWT', err);
      return null;
    }
  }

  // 👤 Récupérer le rôle
  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (decoded?.roles) return decoded.roles;
    return decoded?.role ? [decoded.role] : [];
  }


  // ✔️ Savoir si l’utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
  getEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.email || decoded?.sub || null;
  }
  resendActivationToken(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/resend-activation`, { email });
  }
  checkAccountStatus(email: string): Observable<AccountStatusResponse> {
    return this.http.get<AccountStatusResponse>(`${this.API_URL}/auth/check-account-status`, {
      params: { email }
    });
  }

}
