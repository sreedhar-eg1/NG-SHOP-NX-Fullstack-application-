import { Route } from '@angular/router';
import { LoginComponent } from '@frontend/users';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent, data: { redirectUrl: '/' } },
  // Home, ProductList, ProductDetail, Cart, Checkout routes will go here
];
