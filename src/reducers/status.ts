import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from '../constants';
import { RepositoryStatusModel } from '../generated/tdr';

export interface StatusState {
  tdrOperational: boolean;
  apiIsUp: boolean;
  serverStatus?: RepositoryStatusModel;
}

export const initialStatusState: StatusState = {
  tdrOperational: true,
  apiIsUp: true,
};

export default {
  status: handleActions(
    {
      [ActionTypes.GET_SERVER_STATUS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          tdrOperational: { $set: action.status.tdrOperational },
          apiIsUp: { $set: action.status.apiIsUp },
          serverStatus: { $set: action.status.serverStatus },
        }),
      [ActionTypes.GET_SERVER_STATUS_FAILURE]: (state, action: any) =>
        immutable(state, {
          tdrOperational: { $set: action.status.tdrOperational },
          apiIsUp: { $set: action.status.apiIsUp },
          serverStatus: { $set: action.status.serverStatus },
        }),
      [ActionTypes.GET_SERVER_STATUS_DOWN]: (state, action: any) =>
        immutable(state, {
          tdrOperational: { $set: action.status.tdrOperational },
          apiIsUp: { $set: action.status.apiIsUp },
        }),
    },
    initialStatusState,
  ),
};
