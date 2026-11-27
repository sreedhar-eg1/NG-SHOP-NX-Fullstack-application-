import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// PrimeNG v18/v19+ Theme Setup
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { AuthEffects, authFeature, jwtInterceptor } from '@frontend/users';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor])),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark', // Prevents accidental OS dark-mode clash
        },
      },
    }),

    // Root NgRx Store & DevTools
    provideStore({
      router: routerReducer,
    }),
    provideState(authFeature),
    provideEffects([AuthEffects]),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
