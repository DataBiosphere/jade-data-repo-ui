import { SnapshotAccessRequestResponse } from 'generated/tdr';
import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { ActionTypes } from 'constants';

export interface SnapshotAccessRequestState {
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
  snapshotAccessRequestRoleMaps: { [key: string]: Array<string> };
  loading: boolean;
  refreshCnt: number;
}
export const initialSnapshotAccessRequestState: SnapshotAccessRequestState = {
  snapshotAccessRequests: [],
  snapshotAccessRequestRoleMaps: {},
  loading: false,
  refreshCnt: 0,
};

export default {
  snapshotAccessRequests: handleActions(
    {
      [ActionTypes.GET_SNAPSHOT_ACCESS_REQUESTS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_SNAPSHOT_ACCESS_REQUESTS_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.GET_SNAPSHOT_ACCESS_REQUESTS_SUCCESS]: (state, action: any): any =>
        immutable(state, {
          snapshotAccessRequests: { $set: action.snapshotAccessRequests.data.data.items },
          loading: { $set: false },
        }),
      [ActionTypes.REFRESH_SNAPSHOT_ACCESS_REQUESTS]: (state) =>
        immutable(state, {
          refreshCnt: { $set: state.refreshCnt + 1 },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialSnapshotAccessRequestState,
    },
    initialSnapshotAccessRequestState,
  ),
};
