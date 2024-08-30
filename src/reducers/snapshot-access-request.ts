import { SnapshotAccessRequestDetailsResponse, SnapshotAccessRequestResponse } from 'generated/tdr';
import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { ActionTypes } from 'constants';

export interface SnapshotAccessRequestState {
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
  snapshotAccessRequestRoleMaps: { [key: string]: Array<string> };
  snapshotAccessRequestDetails?: SnapshotAccessRequestDetailsResponse;
  loadingSnapshotAccessRequestDetails: boolean;
  loading: boolean;
  refreshCnt: number;
}
export const initialSnapshotAccessRequestState: SnapshotAccessRequestState = {
  snapshotAccessRequests: [],
  snapshotAccessRequestRoleMaps: {},
  snapshotAccessRequestDetails: undefined,
  loadingSnapshotAccessRequestDetails: false,
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
      [ActionTypes.GET_SNAPSHOT_ACCESS_REQUEST_DETAILS]: (state) =>
        immutable(state, {
          loadingSnapshotAccessRequestDetails: { $set: true },
        }),
      [ActionTypes.GET_SNAPSHOT_ACCESS_REQUEST_DETAILS_FAILURE]: (state) =>
        immutable(state, {
          loadingSnapshotAccessRequestDetails: { $set: false },
        }),
      [ActionTypes.GET_SNAPSHOT_ACCESS_REQUEST_DETAILS_SUCCESS]: (state, action: any): any =>
        immutable(state, {
          snapshotAccessRequestDetails: { $set: action.snapshotAccessRequestDetails.data.data },
          loadingSnapshotAccessRequestDetails: { $set: false },
        }),
      [ActionTypes.REFRESH_SNAPSHOT_ACCESS_REQUESTS]: (state) =>
        immutable(state, {
          refreshCnt: { $set: state.refreshCnt + 1 },
        }),
      [ActionTypes.APPROVE_SNAPSHOT_ACCESS_REQUEST]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.APPROVE_SNAPSHOT_ACCESS_REQUEST_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.APPROVE_SNAPSHOT_ACCESS_REQUEST_SUCCESS]: (state): any =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.REJECT_SNAPSHOT_ACCESS_REQUEST]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.REJECT_SNAPSHOT_ACCESS_REQUEST_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.REJECT_SNAPSHOT_ACCESS_REQUEST_SUCCESS]: (state): any =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialSnapshotAccessRequestState,
    },
    initialSnapshotAccessRequestState,
  ),
};
