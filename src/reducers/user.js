import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import _ from 'lodash';

import { IMAGE, STATUS, ActionTypes } from 'constants/index';

const JADE_FEATURE_PREFIX = 'jade-feature-';

export const userState = {
  isInitiallyLoaded: false,
  isAuthenticated: false,
  status: STATUS.IDLE,
  name: '', // TODO is there a placeholder that this should get? go google accounts ever not have names?
  image: IMAGE.DEFAULT, // with default the material ui AccountCircle image will show
  email: '',
  token: '',
  tokenExpiration: '',
  features: {},
  isTimeoutEnabled: false,
};

export default {
  user: handleActions(
    {
      [ActionTypes.USER_LOGIN]: (state, action) =>
        immutable(state, {
          isInitiallyLoaded: { $set: true },
          isAuthenticated: { $set: true },
          status: { $set: STATUS.READY },
          name: { $set: action.payload.name },
          image: { $set: action.payload.image },
          email: { $set: action.payload.email },
          token: { $set: action.payload.token },
          tokenExpiration: { $set: action.payload.tokenExpiration },
          id: { $set: action.payload.id },
        }),
      [ActionTypes.USER_LOGOUT]: (state) =>
        immutable(state, {
          isInitiallyLoaded: { $set: true },
          isAuthenticated: { $set: false },
          status: { $set: STATUS.IDLE },
          image: { $set: IMAGE.DEFAULT },
          name: { $set: '' },
          email: { $set: '' },
          token: { $set: '' },
          tokenExpiration: { $set: '' },
          features: { $set: {} },
        }),
      [ActionTypes.GET_FEATURES_SUCCESS]: (state, action) => {
        const isTimeoutEnabled = _.some(action.groups, { groupName: 'session_timeout' });
        const features = {};
        action.groups
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
    userState,
  ),
};
