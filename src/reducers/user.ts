import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import _ from 'lodash';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import moment from 'moment';
import { User } from 'oidc-client-ts';
import { PayloadAction } from '@reduxjs/toolkit';

import { ActionTypes, Status } from '../constants';
import { ManagedGroupMembershipEntry } from '../models/group';

const JADE_FEATURE_PREFIX = 'jade-feature-';

export interface UserState {
  isInitiallyLoaded: boolean;
  isAuthenticated: boolean;
  status: Status;
  name: string;
  image?: string;
  email: string;
  token: string;
  delegateToken: string;
  tokenExpiration?: number;
  features: { [key: string]: boolean };
  isTimeoutEnabled: boolean;
  id: string;
  isTest: boolean;
}

export const initialUserState: UserState = {
  isInitiallyLoaded: false,
  isAuthenticated: false,
  status: Status.IDLE,
  name: '', // TODO is there a placeholder that this should get? go google accounts ever not have names?
  email: '',
  token: '',
  delegateToken: '',
  tokenExpiration: 0,
  features: {},
  isTimeoutEnabled: false,
  id: '',
  isTest: false,
};

function adaptTimestamp(timestamp?: number) {
  if (!timestamp) {
    return timestamp;
  }
  // If the date is before 1971, assume that the timestamp is in seconds
  // This approach should work until 3054-10-13 (e.g. new Date(1971,1,1).getTime() * 1000
  if (moment(timestamp).isSameOrBefore(new Date(1971, 1, 1))) {
    return timestamp * 1000;
  }
  return timestamp;
}

function extractExpiration(id_token?: string) {
  try {
    const jwt: JwtPayload = jwt_decode(`${id_token}`);
    return jwt.exp;
  } catch (e) {
    return 0;
  }
}

export default {
  user: handleActions<UserState, any>(
    {
      [ActionTypes.USER_LOGIN_SUCCESS]: (state, action: PayloadAction<User>) =>
        immutable(state, {
          isAuthenticated: { $set: true },
          isInitiallyLoaded: { $set: action.payload.profile.email === 'user.email' },
          status: { $set: Status.READY },
          name: { $set: action.payload.profile.name || initialUserState.name },
          image: { $set: action.payload.profile.picture },
          email: { $set: action.payload.profile.email || initialUserState.email },
          token: { $set: action.payload.access_token || action.payload.id_token || '' },
          delegateToken: {
            $set: (action.payload.profile.idp_access_token ||
              action.payload.access_token ||
              action.payload.id_token) as string,
          },
          tokenExpiration: {
            $set: adaptTimestamp(
              action.payload.expires_at || extractExpiration(action.payload.id_token),
            ),
          },
          id: { $set: action.payload.profile.sub },
          isTest: { $set: action.payload.profile.email === 'user.email' },
        }),
      [ActionTypes.USER_REFRESH]: (state, action: PayloadAction<User>) =>
        immutable(state, {
          isAuthenticated: { $set: true },
          status: { $set: Status.READY },
          token: { $set: action.payload.access_token || action.payload.id_token || '' },
          delegateToken: {
            $set: (action.payload.profile.idp_access_token ||
              action.payload.access_token ||
              action.payload.id_token) as string,
          },
          tokenExpiration: {
            $set: adaptTimestamp(
              action.payload.expires_at || extractExpiration(action.payload.id_token),
            ),
          },
        }),
      [ActionTypes.GET_USER_STATUS_SUCCESS]: (state) =>
        immutable(state, {
          isInitiallyLoaded: { $set: true },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: (state) =>
        immutable(state, {
          isInitiallyLoaded: { $set: true },
          isAuthenticated: { $set: false },
          status: { $set: initialUserState.status },
          image: { $set: initialUserState.image },
          name: { $set: '' },
          email: { $set: '' },
          token: { $set: '' },
          tokenExpiration: { $set: 0 },
          features: { $set: {} },
        }),
      [ActionTypes.GET_FEATURES_SUCCESS]: (
        state,
        action: PayloadAction<ManagedGroupMembershipEntry[]>,
      ) => {
        const isTimeoutEnabled = _.some(action.payload, { groupName: 'session_timeout' });
        const features: { [key: string]: boolean } = {};
        action.payload
          .map((group) => group.groupName)
          .filter((groupName) => groupName.startsWith(JADE_FEATURE_PREFIX))
          .map((feature) => feature.substring(JADE_FEATURE_PREFIX.length))
          .forEach((feature) => {
            features[feature] = true;
          });

        return immutable(state, {
          features: { $set: features },
          isTimeoutEnabled: { $set: isTimeoutEnabled },
        });
      },
    },
    initialUserState,
  ),
};
