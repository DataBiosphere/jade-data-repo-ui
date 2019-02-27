import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const appState = {
  alerts: [],
};

export default {
  app: handleActions(
    {
      [ActionTypes.HIDE_ALERT]: (state, { payload: { id } }) => {
        const alerts = state.alerts.filter(d => d.id !== id);

        return immutable(state, {
          alerts: { $set: alerts },
        });
      },
      [ActionTypes.SHOW_ALERT]: (state, { payload }) =>
        immutable(state, {
          alerts: { $push: [payload] },
        }),
    },
    appState,
  ),
};
