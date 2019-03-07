import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { IMAGE, STATUS, ActionTypes } from 'constants/index';

export const userState = {
  isAuthenticated: false,
  status: STATUS.IDLE,
  name: '', // TODO is there a placeholder that this should get? go google accounts ever not have names?
  image: IMAGE.DEFAULT, // with default the material ui AccountCircle image will show
};

export default {
  user: handleActions(
    {
      [ActionTypes.USER_LOGIN]: (state, action) =>
        immutable(state, {
          isAuthenticated: { $set: true },
          status: { $set: STATUS.READY },
          name: { $set: action.payload.name },
          image: { $set: action.payload.image },
        }),
      [ActionTypes.USER_LOGOUT]: state =>
        immutable(state, {
          isAuthenticated: { $set: false },
          status: { $set: STATUS.IDLE },
          image: { $set: IMAGE.DEFAULT },
        }),
    },
    userState,
  ),
};
