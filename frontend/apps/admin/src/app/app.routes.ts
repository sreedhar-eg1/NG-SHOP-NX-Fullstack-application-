import { Route } from '@angular/router';

import { adminGuard, LoginComponent } from '@frontend/users';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent,
    data: { redirectUrl: '/dashboard' }, // Binds automatically via withComponentInputBinding()
  },
  {
    path: '',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      // Dashboard, Categories, Products, Orders, Users routes will go here
    ],
  },
  { path: '**', redirectTo: '' },
];
