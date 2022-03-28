import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from '../constants';
import { DatasetModel, DatasetSummaryModel, PolicyModel, SnapshotSummaryModel } from '../generated/tdr';

export interface DatasetState {
  datasets: Array<DatasetSummaryModel>,
  dataset: DatasetModel,
  datasetsCount: number,
  datasetPolicies: Array<PolicyModel>,
  userRoles: Array<string>,
  datasetSnapshots: Array<SnapshotSummaryModel>,
  datasetSnapshotsCount: number,
};

export const initialDatasetState: DatasetState = {
  datasets: [],
  dataset: {},
  datasetsCount: 0,
  datasetPolicies: [],
  userRoles: [],
  datasetSnapshots: [],
  datasetSnapshotsCount: 0,
};

// We need this method to apply the response from add/remove snapshot members since the API only returns the affected group
const datasetMembershipResultApply = (action: any) => (datasetPolicies: any) =>
  datasetPolicies.map((p: any) => {
    if (p.name === action.policy) {
      const policy = action.dataset.data.data.policies.find((ap: any) => ap.name === action.policy);
      return policy || p;
    }
    return p;
  });

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state: any, action: any): any =>
        immutable(state, {
          datasets: { $set: action.datasets.data.data.items },
          datasetsCount: { $set: action.datasets.data.data.total },
          filteredDatasetsCount: { $set: action.datasets.data.data.filteredTotal },
        }),
      [ActionTypes.GET_DATASET_BY_ID]: (state) =>
        immutable(state, {
          dataset: {},
        }),
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          dataset: { $set: action.dataset.data.data },
        }),
      [ActionTypes.GET_DATASET_POLICY_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.ADD_CUSTODIAN_TO_DATASET_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.REMOVE_CUSTODIAN_FROM_DATASET_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.ADD_DATASET_POLICY_MEMBER_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          datasetPolicies: { $apply: datasetMembershipResultApply(action) },
        }),
      [ActionTypes.REMOVE_DATASET_POLICY_MEMBER_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          datasetPolicies: { $apply: datasetMembershipResultApply(action) },
        }),
      [ActionTypes.GET_USER_DATASET_ROLES]: (state: any) =>
        immutable(state, {
          userRoles: { $set: [] },
        }),
      [ActionTypes.GET_USER_DATASET_ROLES_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          userRoles: { $set: action.roles.data },
        }),
      [ActionTypes.GET_DATASET_SNAPSHOTS_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          datasetSnapshots: { $set: action.snapshots.data.data.items },
          datasetSnapshotsCount: { $set: action.snapshots.data.data.total },
        }),
      [ActionTypes.GET_DATASET_TABLE_PREVIEW_SUCCESS]: (state: any, action: any) => {
        const i = state.dataset.schema.tables.findIndex(
          (table: any) => table.name === action.tableName,
        );
        return immutable(state, {
          dataset: { schema: { tables: { [i]: { preview: { $set: action.preview.data.rows } } } } },
        });
      },
      [ActionTypes.USER_LOGOUT]: () => initialDatasetState,
    },
    initialDatasetState,
  ),
};
