import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const AuthGuardUser: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (!token) {
    router.navigate(['/login']).then(() => false);
    return false;
  }

  try {
    const decoded: any = jwtDecode(token);
    const roles: string[] = decoded?.roles || [];
    if (roles.includes('ROLE_USER')) {
      return true;
    }
  } catch (err) {
    console.warn('❌ Token invalide', err);
    localStorage.removeItem('authToken');
  }

  router.navigate(['/login']).then(() => false);
  return false;
};
