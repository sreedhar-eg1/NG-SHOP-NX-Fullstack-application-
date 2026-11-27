import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/localstorage.service';

import { AuthAction } from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  buildUserSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.buildUserSession),
      map(() => {
        if (this.localStorage.isValidToken()) {
          const decoded = this.localStorage.decodeToken();
          const token = this.localStorage.getToken();

          if (decoded && token) {
            return AuthAction.buildUserSessionSuccess({
              userId: decoded.userId,
              isAdmin: decoded.isAdmin,
              token,
            });
          }
        }

        return AuthAction.buildUserSessionFailure();
      }),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthAction.login),
      exhaustMap(({ email, password, redirectUrl }) =>
        this.authService.login(email, password).pipe(
          map((response) => AuthAction.loginSuccess({ response, redirectUrl })),
          catchError((err) =>
            of(
              AuthAction.loginFailure({
                error: err?.error?.message || 'Login failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthAction.loginSuccess),
        tap(({ response, redirectUrl }) => {
          this.localStorage.setToken(response.token);
          this.router.navigateByUrl(redirectUrl || '/');
        }),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthAction.logout),
        tap(() => {
          this.localStorage.removeToken();
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
