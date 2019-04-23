import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const appState = {
  alerts: [],
};

export default {
  app: handleActions(
    {
      [ActionTypes.HIDE_ALERT]: (state, { payload }) => {
        const alerts = state.alerts.filter((d, i) => i !== payload);
        return immutable(state, {
          alerts: { $set: alerts },
        });
      },
      [ActionTypes.SHOW_ALERT]: (state, { payload }) => {
        return immutable(state, {
          alerts: { $push: [payload] },
        });
      },
      [ActionTypes.EXCEPTION]: (state, { payload }) => {
        return immutable(state, {
          alerts: { $push: [payload] },
        });
      },
    },
    appState,
  ),
};
