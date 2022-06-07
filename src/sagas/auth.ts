import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AuthContextProps } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { PayloadAction } from '@reduxjs/toolkit';

import { ActionTypes } from '../constants';

function* userLogin({ payload }: PayloadAction<AuthContextProps>) {
  try {
    const response: User = yield call(payload.signinPopup);
    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
      payload: response,
    });

    // Note the code below should in spirit match the auth logic in App.jsx
    // Invoke reading getting the user's status
    yield put({
      type: ActionTypes.GET_USER_STATUS,
    });

    // Add user info load listener
    yield payload.events.addUserLoaded((u) => {
      put({
        type: ActionTypes.USER_REFRESH,
        payload: u,
      });
    });
  } catch (err) {
    //eslint-disable-next-line no-console
    console.log('Error signing in', err);
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
    });
  }
}

function* userLogout({ payload }: PayloadAction<AuthContextProps>) {
  try {
    yield call(payload.removeUser);
    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (err) {
    //eslint-disable-next-line no-console
    console.log('Error signing out', err);
    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.USER_LOGIN, userLogin),
    takeLatest(ActionTypes.USER_LOGOUT, userLogout),
  ]);
}
