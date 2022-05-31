// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createAction } from 'redux-actions';

import { ActionTypes } from 'constants/index';
import { AuthContextProps } from 'react-oidc-context';
import { User } from 'oidc-client-ts';
import { ManagedGroupMembershipEntry } from 'models/group';

export const logIn = createAction<AuthContextProps>(ActionTypes.USER_LOGIN);
export const logInSuccess = createAction<User>(ActionTypes.USER_LOGIN_SUCCESS);
export const logInFailure = createAction<void>(ActionTypes.USER_LOGIN_FAILURE);
export const userRefresh = createAction<User>(ActionTypes.USER_REFRESH);
export const logOut = createAction<AuthContextProps>(ActionTypes.USER_LOGOUT);
export const getUserStatus = createAction<AuthContextProps>(ActionTypes.GET_USER_STATUS);
export const getUserStatusSuccess = createAction<User>(ActionTypes.GET_USER_STATUS_SUCCESS);
export const getUserStatusFailure = createAction<User>(ActionTypes.GET_USER_STATUS_FAILURE);

export const getFeatures = createAction<void>(ActionTypes.GET_FEATURES);
export const getFeaturesSuccess = createAction<ManagedGroupMembershipEntry[]>(
  ActionTypes.GET_FEATURES_SUCCESS,
);
