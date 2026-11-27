import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { LocalStorageService } from '../services/localstorage.service';

import { authFeature } from '../state/auth.reducer';
import { environment } from '@frontend/ui';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const localStorage = inject(LocalStorageService);

  // Read token synchronously via NgRx Signal selector (with localStorage fallback on bootstrap)
  const token =
    store.selectSignal(authFeature.selectToken) || localStorage.getToken();
  const isApiUrl = environment.apiUrl;

  if (token && isApiUrl) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
