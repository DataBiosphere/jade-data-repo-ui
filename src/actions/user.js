// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { userLogin: logIn, userLogout: logOut } = createActions({
  [ActionTypes.USER_LOGIN]: (name, image, email, token, tokenExpiration, id) => ({
    name,
    image,
    email,
    token,
    tokenExpiration,
    id,
  }),
  [ActionTypes.USER_LOGOUT]: () => ({}),
});

export const { getFeatures } = createActions({
  [ActionTypes.GET_FEATURES]: () => ({}),
  [ActionTypes.GET_FEATURES_SUCCESS]: (groups) => groups,
});
