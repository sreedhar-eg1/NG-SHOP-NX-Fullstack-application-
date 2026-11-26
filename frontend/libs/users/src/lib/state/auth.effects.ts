import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/localstorage.service';

import { authAction } from './auth.actions';
import { map } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  buildUserSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authAction.buildUserSession),
      map(() => {
        if (this.localStorage.isValidToken()) {
          const decoded = this.localStorage.decodeToken();
          const token = this.localStorage.getToken();

          if (decoded && token) {
            return authAction.buildUserSessionSuccess({
              userId: decoded.userId,
              isAdmin: decoded.isAdmin,
              token,
            });
          }
        }

        return authAction.buildUserSessionFailure();
      }),
    ),
  );
}


