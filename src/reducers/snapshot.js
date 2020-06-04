import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import BigQuery from 'modules/bigquery';

import { ActionTypes } from 'constants/index';

export const snapshotState = {
  createdSnapshots: [],
  snapshot: {},
  snapshots: [],
  exception: false,
  snapshotPolicies: [],
  dataset: {},
  snapshotCount: 0,
  dialogIsOpen: false,
  filterStatement: '',
  joinStatement: '',
};

export default {
  snapshots: handleActions(
    {
      [ActionTypes.GET_SNAPSHOTS_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshots: { $set: action.snapshots.data.data.items },
          snapshotCount: { $set: action.snapshots.data.data.total },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state, action) => {
        const newSnapshotCreation = {
          jobId: action.payload.jobId,
          snapshotRequest: action.payload.snapshotRequest,
        };
        return immutable(state, {
          createdSnapshots: { $push: [newSnapshotCreation] },
          snapshot: { $set: {} },
        });
      },
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshot: { $set: action.payload.jobResult },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state, action) => {
        const successfullyCreatedSnapshots = state.createdSnapshots; // passes a ref or a value?
        successfullyCreatedSnapshots.filter((snapshot) => snapshot.jobId !== action.payload.jobId);
        return immutable(state, {
          createdSnapshots: { $set: successfullyCreatedSnapshots },
        });
      },
      [ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshot: { $set: action.snapshot.data.data },
        }),
      [ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshotPolicies: { $set: action.snapshot.data.data.policies },
        }),
      [ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshotPolicies: { $set: action.snapshot.data.data.policies },
        }),
      [ActionTypes.REMOVE_READER_FROM_SNAPSHOT_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshotPolicies: { $set: action.snapshot.data.data.policies },
        }),
      [ActionTypes.EXCEPTION]: (state) =>
        immutable(state, {
          exception: { $set: true },
        }),
      [ActionTypes.OPEN_SNAPSHOT_DIALOG]: (state, action) =>
        immutable(state, {
          dialogIsOpen: { $set: action.payload },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action) => {
        const bigquery = new BigQuery();
        const filterStatement = bigquery.buildSnapshotFilterStatement(
          action.payload.filters,
          action.payload.dataset,
        );

        const joinStatement = bigquery.buildSnapshotJoinStatement(
          action.payload.filters,
          action.payload.table,
          action.payload.dataset,
        );

        return immutable(state, {
          filterStatement: { $set: filterStatement },
          joinStatement: { $set: joinStatement },
        });
      },
    },
    snapshotState,
  ),
};
