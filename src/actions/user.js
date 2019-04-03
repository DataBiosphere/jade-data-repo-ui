// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { userLogin: logIn, userLogout: logOut } = createActions({
  [ActionTypes.USER_LOGIN]: (name, image, token, tokenExpiration) => ({
    name,
    image,
    token,
    tokenExpiration,
  }),
  [ActionTypes.USER_LOGOUT]: () => ({}),
});
