import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LocalStorageService } from '../services/localstorage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const localStorage = inject(LocalStorageService);

  if (localStorage.isValidToken()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
