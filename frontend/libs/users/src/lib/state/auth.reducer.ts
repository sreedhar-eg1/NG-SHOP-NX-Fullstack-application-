import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { AuthAction } from './auth.actions';

export interface AuthState {
  userId: string | null;
  email: string | null;
  token: string | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  token: null,
  isAdmin: false,
  loading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(
      AuthAction.buildUserSessionSuccess,
      (state, { userId, isAdmin, token }) => ({
        ...state,
        userId,
        isAdmin,
        token,
      }),
    ),
    on(AuthAction.buildUserSessionFailure, () => initialState),

    on(AuthAction.login, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthAction.loginSuccess, (state, { response }) => ({
      ...state,
      userId: response.userId,
      email: response.user,
      isAdmin: response.isAdmin,
      token: response.token,
      loading: false,
      error: null,
    })),
    on(AuthAction.loginFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(AuthAction.logout, () => initialState),
  ),
  extraSelectors: ({ selectToken }) => ({
    selectIsAuthenticated: createSelector(selectToken, (token) => !!token),
  }),
});
