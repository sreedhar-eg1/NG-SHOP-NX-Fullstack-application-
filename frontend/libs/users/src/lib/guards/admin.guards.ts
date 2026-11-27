import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/localstorage.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localStorage = inject(LocalStorageService);

  if (localStorage.isValidToken()) {
    const decoded = localStorage.decodeToken();

    if (decoded?.isAdmin) return true;
  }

  return router.createUrlTree(['/login']);
};
