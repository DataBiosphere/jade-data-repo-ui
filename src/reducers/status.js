import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const statusState = {
  tdrOperational: true,
  apiIsUp: true,
  serverStatus: {},
};

export default {
  status: handleActions(
    {
      [ActionTypes.GET_SERVER_STATUS_SUCCESS]: (state, action) =>
        immutable(state, {
          tdrOperational: { $set: action.status.tdrOperational },
          apiIsUp: { $set: action.status.apiIsUp },
          serverStatus: { $set: action.status.serverStatus },
        }),
      [ActionTypes.GET_SERVER_STATUS_FAILURE]: (state, action) =>
        immutable(state, {
          tdrOperational: { $set: action.status.tdrOperational },
          apiIsUp: { $set: action.status.apiIsUp },
          serverStatus: { $set: action.status.serverStatus },
        }),
      [ActionTypes.GET_SERVER_STATUS_DOWN]: (state, action) =>
        immutable(state, {
          tdrOperational: { $set: action.status.tdrOperational },
          apiIsUp: { $set: action.status.apiIsUp },
        }),
    },
    statusState,
  ),
};
