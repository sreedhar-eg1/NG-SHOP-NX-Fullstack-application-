import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/localstorage.service';

import { authAction } from './auth.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';

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

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authAction.login),
      exhaustMap(({ email, password, redirectUrl }) =>
        this.authService.login(email, password).pipe(
          map((response) => authAction.loginSuccess({ response, redirectUrl })),
          catchError((err) =>
            of(
              authAction.loginFailure({
                error: err?.error?.message || 'Login failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
