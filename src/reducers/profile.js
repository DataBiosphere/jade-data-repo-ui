import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const profileState = {
  profiles: [],
  profile: {},
};

export default {
  profiles: handleActions(
    {
      [ActionTypes.GET_BILLING_PROFILE_BY_ID]: (state) =>
        immutable(state, {
          profile: {},
        }),
      [ActionTypes.GET_BILLING_PROFILE_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          profile: { $set: action.profile.data.data },
        }),
      [ActionTypes.USER_LOGOUT]: () => profileState,
    },
    profileState,
  ),
};
