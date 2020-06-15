import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import BigQuery from 'modules/bigquery';
import { LOCATION_CHANGE } from 'connected-react-router';

import { ActionTypes } from 'constants/index';

export const snapshotState = {
  // snapshot info
  createdSnapshots: [],
  snapshot: {},
  snapshots: [],
  exception: false,
  snapshotPolicies: [],
  dataset: {},
  snapshotCount: 0,
  dialogIsOpen: false,
  // for snapshot creation
  filterStatement: '',
  joinStatement: '',
  name: '',
  description: '',
  readers: [],
  assetName: '',
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
        return immutable(state, {
          snapshot: { $set: {} },
        });
      },
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshot: { $set: action.payload.jobResult },
          dialogIsOpen: { $set: true },
          // TODO: maybe wrap these in an object
          filterStatement: { $set: '' },
          joinStatement: { $set: '' },
          name: { $set: '' },
          description: { $set: '' },
          readers: { $set: [] },
          assetName: { $set: '' },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state, action) => {
        const successfullyCreatedSnapshots = state.createdSnapshots; // passes a ref or a value?
        successfullyCreatedSnapshots.filter((snapshot) => snapshot.jobId !== action.payload.jobId);
        return immutable(state, {
          createdSnapshots: { $set: successfullyCreatedSnapshots },
          dialogIsOpen: { $set: true },
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
      [ActionTypes.SNAPSHOT_CREATE_DETAILS]: (state, action) =>
        immutable(state, {
          name: { $set: action.payload.name },
          description: { $set: action.payload.description },
          assetName: { $set: action.payload.assetName },
        }),
      [ActionTypes.ADD_READERS_TO_SNAPSHOT]: (state, action) =>
        immutable(state, {
          readers: { $set: action.payload },
        }),

      [LOCATION_CHANGE]: (state) => {
        return immutable(state, {
          filterStatement: { $set: '' },
          joinStatement: { $set: '' },
          name: { $set: '' },
          description: { $set: '' },
          readers: { $set: [] },
          assetName: { $set: '' },
        });
      },
    },
    snapshotState,
  ),
};
