import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from '../constants';
import { RepositoryConfigurationModel } from '../generated/tdr';

export interface ConfigurationState {
  configObject: RepositoryConfigurationModel;
}

export const initialConfigurationState: ConfigurationState = {
  configObject: {},
};

export default {
  configuration: handleActions(
    {
      [ActionTypes.GET_CONFIGURATION_SUCCESS]: (state: ConfigurationState, action: any) =>
        immutable(state, { configObject: { $set: action.configuration } }),
    },
    initialConfigurationState,
  ),
};
