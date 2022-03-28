import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from '../constants';
import { BillingProfileModel } from '../generated/tdr';

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
      [ActionTypes.GET_BILLING_PROFILE_BY_ID]: (state: any) =>
        immutable(state, {
          profile: {},
        }),
      [ActionTypes.GET_BILLING_PROFILE_BY_ID_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          profile: { $set: action.profile.data.data },
        }),
      [ActionTypes.GET_BILLING_PROFILE_BY_ID_EXCEPTION]: (state: any) =>
        immutable(state, {
          profile: {},
        }),
      [ActionTypes.USER_LOGOUT]: () => initialProfileState,
    },
    initialProfileState,
  ),
};
