import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { LOCATION_CHANGE } from 'connected-react-router';

import { ActionTypes } from '../constants';
import {
  DatasetModel,
  DatasetSummaryModel,
  PolicyModel,
  SnapshotSummaryModel,
} from '../generated/tdr';

export interface DatasetState {
  datasets: Array<DatasetSummaryModel>;
  datasetRoleMaps: { [key: string]: Array<string> };
  dataset: DatasetModel;
  datasetPreview: Record<string, Array<Record<string, any>>>;
  datasetsCount: number;
  filteredDatasetsCount: number;
  datasetPolicies: Array<PolicyModel>;
  userRoles: Array<string>;
  datasetSnapshots: Array<SnapshotSummaryModel>;
  datasetSnapshotsCount: number;
  loading: boolean;
  isAddingOrRemovingUser: boolean;
  refreshCnt: number;
  // for dataset creation
  dialogIsOpen: boolean;
  creationIsProcessing: boolean;
  exportResponse?: DatasetModel;
}

export const initialDatasetState: DatasetState = {
  datasets: [],
  datasetRoleMaps: {},
  dataset: {},
  datasetPreview: {},
  datasetsCount: 0,
  filteredDatasetsCount: 0,
  datasetPolicies: [],
  userRoles: [],
  datasetSnapshots: [],
  datasetSnapshotsCount: 0,
  loading: false,
  isAddingOrRemovingUser: false,
  refreshCnt: 0,
  dialogIsOpen: false,
  creationIsProcessing: false,
};

// We need this method to apply the response from add/remove snapshot members since the API only returns the affected group
const datasetMembershipResultApply = (action: any) => (
  datasetPolicies: Array<PolicyModel>,
): Array<PolicyModel> =>
  datasetPolicies.map((p) => {
    if (p.name === action.policy) {
      const policy = action.dataset.data.data.policies.find((ap: any) => ap.name === action.policy);
      return policy || p;
    }
    return p;
  });

export default {
  datasets: handleActions(
    {
      [ActionTypes.CREATE_DATASET]: (state) =>
        immutable(state, {
          dataset: { $set: {} },
          dialogIsOpen: { $set: true },
          creationIsProcessing: { $set: true },
        }),
      [ActionTypes.CREATE_DATASET_JOB]: (state) =>
        immutable(state, {
          dataset: { $set: {} },
          dialogIsOpen: { $set: true },
          creationIsProcessing: { $set: true },
        }),
      [ActionTypes.CREATE_DATASET_SUCCESS]: (state, action: any) =>
        immutable(state, {
          dataset: { $set: action.payload.jobResult },
          creationIsProcessing: { $set: false },
        }),
      [ActionTypes.CREATE_DATASET_FAILURE]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
          creationIsProcessing: { $set: false },
        }),
      [ActionTypes.CREATE_DATASET_EXCEPTION]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
          creationIsProcessing: { $set: false },
        }),
      [ActionTypes.GET_DATASETS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_DATASETS_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action: any): any =>
        immutable(state, {
          datasets: { $set: action.datasets.data.data.items },
          datasetRoleMaps: { $set: action.datasets.data.data.roleMap },
          datasetsCount: { $set: action.datasets.data.data.total },
          filteredDatasetsCount: { $set: action.datasets.data.data.filteredTotal },
          loading: { $set: false },
        }),
      [ActionTypes.REFRESH_DATASETS]: (state) =>
        immutable(state, {
          refreshCnt: { $set: state.refreshCnt + 1 },
        }),
      [ActionTypes.GET_DATASET_BY_ID]: (state) =>
        immutable(state, {
          dataset: {},
        }),
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state, action: any) =>
        immutable(state, {
          dataset: { $set: action.dataset.data.data },
        }),
      [ActionTypes.GET_DATASET_POLICY_SUCCESS]: (state, action: any) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.PATCH_DATASET_SUCCESS]: (state, action: any) => {
        const datasetObj: any = { dataset: {} };
        if (action.data.phsId !== undefined) {
          datasetObj.dataset.phsId = { $set: action.data.phsId };
        }
        if (action.data.description !== undefined) {
          datasetObj.dataset.description = { $set: action.data.description };
        }
        return immutable(state, datasetObj);
      },
      [ActionTypes.ADD_DATASET_POLICY_MEMBER]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: true },
        }),
      [ActionTypes.ADD_DATASET_POLICY_MEMBER_FAILURE]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.ADD_DATASET_POLICY_MEMBER_SUCCESS]: (state, action: any) =>
        immutable(state, {
          datasetPolicies: { $apply: datasetMembershipResultApply(action) },
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.REMOVE_DATASET_POLICY_MEMBER]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: true },
        }),
      [ActionTypes.REMOVE_DATASET_POLICY_MEMBER_FAILURE]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.REMOVE_DATASET_POLICY_MEMBER_SUCCESS]: (state, action: any) =>
        immutable(state, {
          datasetPolicies: { $apply: datasetMembershipResultApply(action) },
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.GET_USER_DATASET_ROLES]: (state) =>
        immutable(state, {
          userRoles: { $set: [] },
        }),
      [ActionTypes.GET_USER_DATASET_ROLES_SUCCESS]: (state, action: any) =>
        immutable(state, {
          userRoles: { $set: action.roles.data },
        }),
      [ActionTypes.GET_DATASET_SNAPSHOTS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_DATASET_SNAPSHOTS_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.GET_DATASET_SNAPSHOTS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          datasetSnapshots: { $set: action.snapshots.data.data.items },
          datasetSnapshotsCount: { $set: action.snapshots.data.data.total },
          loading: { $set: false },
        }),
      [ActionTypes.GET_DATASET_TABLE_PREVIEW_SUCCESS]: (state, action: any) => {
        const i = state.dataset?.schema?.tables.findIndex(
          (table: any) => table.name === action.tableName,
        );
        if (i === undefined) {
          return state;
        }
        return immutable(state, {
          datasetPreview: { [action.tableName]: { $set: action.preview.data.rows } },
        });
      },
      [LOCATION_CHANGE]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialDatasetState,
    },
    initialDatasetState,
  ),
};
