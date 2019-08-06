import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const configurationState = {
  configuration: {},
};

export default {
  configuration: handleActions(
    {
      [ActionTypes.GET_CONFIGURATION_SUCCESS]: (state, action) =>
        immutable(state, {
          configuration: { $set: action.configuration.data.data },
        }),
    },
    configurationState,
  ),
};
