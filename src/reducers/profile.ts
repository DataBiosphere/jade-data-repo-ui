import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants';
import { BillingProfileModel } from 'generated/tdr';

export interface ProfileState {
  profiles: Array<BillingProfileModel>;
  profile: BillingProfileModel;
}

export const initialProfileState: ProfileState = {
  profiles: [],
  profile: {},
};

export default {
  profiles: handleActions(
    {
      [ActionTypes.GET_BILLING_PROFILES]: (state) => immutable(state, {}),
      [ActionTypes.GET_BILLING_PROFILES_SUCCESS]: (state, action: any) =>
        immutable(state, {
          profiles: { $set: action.profile.data.data.items },
        }),
      [ActionTypes.GET_BILLING_PROFILES_FAILURE]: (state) => immutable(state, {}),
      [ActionTypes.GET_BILLING_PROFILE_BY_ID]: (state) =>
        immutable(state, {
          profile: {},
        }),
      [ActionTypes.GET_BILLING_PROFILE_BY_ID_SUCCESS]: (state, action: any) =>
        immutable(state, {
          profile: { $set: action.profile.data.data },
        }),
      [ActionTypes.GET_BILLING_PROFILE_BY_ID_EXCEPTION]: (state) =>
        immutable(state, {
          profile: {},
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialProfileState,
    },
    initialProfileState,
  ),
};
