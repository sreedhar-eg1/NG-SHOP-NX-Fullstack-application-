import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../services/users.service';
import { UsersActions } from './users.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersService = inject(UsersService);

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((err) =>
            of(
              UsersActions.loadUsersFailure({
                error: err?.error?.message || 'Failed to load users.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
