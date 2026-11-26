import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { LoginResponse } from '../models/user.model';

export const authAction = createActionGroup({
  source: 'Auth',
  events: {
    'Build User Session': emptyProps(),
    'Build User Session Success': props<{
      userId: string;
      isAdmin: boolean;
      token: string;
    }>(),
    'Build User Session Failure': emptyProps(),

    Login: props<{ email: string; password: string; redirectUrl: string }>(),
    'Login Success': props<{ response: LoginResponse; redirectUrl?: string }>(),
    'Login Failure': props<{ error: string }>(),

    Logout: emptyProps(),
  },
});
