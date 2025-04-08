import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const AuthGuardAdmin: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  // Pas de token → on bloque
  if (!token) {
    router.navigate(['/login']).then(() => false);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || [];

    // ✅ Accès autorisé uniquement si ROLE_ADMIN présent
    if (roles.includes('ROLE_ADMIN')) {
      return true;
    }
  } catch (err) {
    console.warn('❌ Token invalide ou corrompu', err);
    localStorage.removeItem('authToken');
  }

  // ❌ Redirection si le rôle ne convient pas ou problème avec le token
  router.navigate(['/login']).then(() => false);
  return false;
};
