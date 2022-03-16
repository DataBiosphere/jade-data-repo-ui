import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const configurationState = {};

export default {
  configuration: handleActions(
    {
      [ActionTypes.GET_CONFIGURATION_SUCCESS]: (state: any, action: any) =>
        immutable(state, { $set: action.configuration }),
    },
    configurationState,
  ),
};
