import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { UsersActions } from './users.actions';

import { User } from '../models/user.model';

// Here we are making use of ngrx/entity, it basically gives us some method which helps us to
// manage state easily
export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

// Provide us with some ready-made method to manage the state
const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user.id ?? '',
});

const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

export const userFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,
    on(UsersActions.loadUsers, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(UsersActions.loadUsersSuccess, (state, { users }) =>
      usersAdapter.setAll(users, { ...state, loading: false }),
    ),
    on(UsersActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(UsersActions.createUser, (state, { user }) =>
      usersAdapter.addOne(user, state),
    ),
    on(UsersActions.updateUser, (state, { user }) =>
      usersAdapter.updateOne({ id: user.id ?? '', changes: user }, state),
    ),
    on(UsersActions.deleteUserSuccess, (state, { userId }) =>
      usersAdapter.removeOne(userId, state),
    ),
  ),
  extraSelectors: ({ selectUsersState }) =>
    usersAdapter.getSelectors(selectUsersState),
});
