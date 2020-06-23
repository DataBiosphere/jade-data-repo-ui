import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import BigQuery from 'modules/bigquery';
import { LOCATION_CHANGE } from 'connected-react-router';

import { ActionTypes } from 'constants/index';

const defaultSnapshotRequest = {
  name: '',
  description: '',
  assetName: '',
  filterStatement: '',
  joinStatement: '',
  readers: [],
};

export const snapshotState = {
  // snapshot info
  snapshot: {},
  snapshots: [],
  exception: false,
  snapshotPolicies: [],
  dataset: {},
  snapshotCount: 0,
  dialogIsOpen: false,
  // for snapshot creation
  snapshotRequest: defaultSnapshotRequest,
};

export default {
  snapshots: handleActions(
    {
      [ActionTypes.GET_SNAPSHOTS_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshots: { $set: action.snapshots.data.data.items },
          snapshotCount: { $set: action.snapshots.data.data.total },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state) =>
        immutable(state, {
          snapshot: { $set: {} },
          dialogIsOpen: { $set: true },
        }),
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state, action) =>
        immutable(state, {
          snapshot: { $set: action.payload.jobResult },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
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
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.OPEN_SNAPSHOT_DIALOG]: (state, action) =>
        immutable(state, {
          dialogIsOpen: { $set: action.payload },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action) => {
        const bigquery = new BigQuery();
        const { filters, table, dataset } = action.payload;

        const filterStatement = bigquery.buildSnapshotFilterStatement(filters, dataset);

        const snapshotRequest = { ...state.snapshotRequest, filterStatement };

        return immutable(state, {
          snapshotRequest: { $set: snapshotRequest },
        });
      },
      [ActionTypes.SNAPSHOT_CREATE_DETAILS]: (state, action) => {
        const bigquery = new BigQuery();
        const { name, description, assetName, filterData, dataset } = action.payload;

        const joinStatement = bigquery.buildSnapshotJoinStatement(filterData, assetName, dataset);
        const snapshotRequest = {
          ...state.snapshotRequest,
          name,
          description,
          assetName,
          joinStatement,
        };

        return immutable(state, {
          snapshotRequest: { $set: snapshotRequest },
        });
      },
      [ActionTypes.ADD_READERS_TO_SNAPSHOT]: (state, action) => {
        const snapshotRequest = { ...state.snapshotRequest, readers: action.payload };
        return immutable(state, {
          snapshotRequest: { $set: snapshotRequest },
        });
      },
      [LOCATION_CHANGE]: (state) =>
        immutable(state, {
          snapshotRequest: { $set: defaultSnapshotRequest },
        }),
    },
    snapshotState,
  ),
};
