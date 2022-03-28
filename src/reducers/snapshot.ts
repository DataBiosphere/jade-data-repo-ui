import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import BigQuery from 'modules/bigquery';
import { LOCATION_CHANGE } from 'connected-react-router';

import { ActionTypes } from '../constants';
import {
  DatasetModel,
  PolicyModel,
  SnapshotExportResponseModel,
  SnapshotModel,
  SnapshotSummaryModel,
} from '../generated/tdr';

//TODO: convert to autogenned SnapshotRequestModel
export interface SnapshotRequest {
  name: string;
  description: string;
  assetName: string;
  filterStatement: string;
  joinStatement: string;
  readers: Array<string>;
}

export interface SnapshotState {
  snapshot: SnapshotModel;
  snapshots: Array<SnapshotSummaryModel>;
  snapshotPolicies: Array<PolicyModel>;
  canReadPolicies: boolean;
  dataset: DatasetModel;
  snapshotCount: number;
  dialogIsOpen: boolean;
  // for snapshot creation
  snapshotRequest: SnapshotRequest;
  userRoles: Array<string>;
  // for snapshot export to workspace
  exportIsProcessing: boolean;
  exportIsDone: boolean;
  exportResponse: SnapshotExportResponseModel;
}

const defaultSnapshotRequest: SnapshotRequest = {
  name: '',
  description: '',
  assetName: '',
  filterStatement: '',
  joinStatement: '',
  readers: [],
};

export const initialSnapshotState: SnapshotState = {
  snapshot: {},
  snapshots: [],
  snapshotPolicies: [],
  canReadPolicies: false,
  dataset: {},
  snapshotCount: 0,
  dialogIsOpen: false,
  // for snapshot creation
  snapshotRequest: defaultSnapshotRequest,
  userRoles: [],
  // for snapshot export to workspace
  exportIsProcessing: false,
  exportIsDone: false,
  exportResponse: {},
};

// We need this method to apply the response from add/remove snapshot members since the API only returns the affected group
const snapshotMembershipResultApply = (action: any) => (snapshotPolicies: any) =>
  snapshotPolicies.map((p: any) => {
    if (p.name === action.policy) {
      const policy = action.snapshot.data.data.policies.find(
        (ap: any) => ap.name === action.policy,
      );
      return policy || p;
    }
    return p;
  });

export default {
  snapshots: handleActions(
    {
      [ActionTypes.GET_SNAPSHOTS_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          snapshots: { $set: action.snapshots.data.data.items },
          snapshotCount: { $set: action.snapshots.data.data.total },
          filteredSnapshotCount: { $set: action.snapshots.data.data.filteredTotal },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state: any) =>
        immutable(state, {
          snapshot: { $set: {} },
          dialogIsOpen: { $set: true },
        }),
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          snapshot: { $set: action.payload.jobResult },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state: any) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.CREATE_SNAPSHOT_EXCEPTION]: (state: any) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_START]: (state: any) =>
        immutable(state, {
          exportIsProcessing: { $set: true },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_JOB]: (state: any) =>
        immutable(state, {
          exportResponse: { $set: {} },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          exportResponse: { $set: action.payload.jobResult },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: true },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_FAILURE]: (state: any) =>
        immutable(state, {
          exportResponse: { $set: {} },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_EXCEPTION]: (state: any) =>
        immutable(state, {
          exportResponse: { $set: {} },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.RESET_SNAPSHOT_EXPORT]: (state: any) =>
        immutable(state, {
          exportResponse: { $set: {} },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          snapshot: { $set: action.snapshot.data.data },
        }),
      [ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          snapshotPolicies: { $set: action.snapshot.data.data.policies },
          canReadPolicies: { $set: true },
        }),
      [ActionTypes.GET_SNAPSHOT_POLICY_FAILURE]: (state: any) =>
        immutable(state, {
          snapshotPolicies: { $set: [] },
          canReadPolicies: { $set: false },
        }),
      [ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          snapshotPolicies: { $apply: snapshotMembershipResultApply(action) },
        }),
      [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          snapshotPolicies: { $apply: snapshotMembershipResultApply(action) },
        }),
      [ActionTypes.GET_USER_SNAPSHOT_ROLES]: (state: any) =>
        immutable(state, {
          userRoles: { $set: [] },
        }),
      [ActionTypes.GET_USER_SNAPSHOT_ROLES_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          userRoles: { $set: action.roles.data },
        }),
      [ActionTypes.EXCEPTION]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.OPEN_SNAPSHOT_DIALOG]: (state: any, action: any) =>
        immutable(state, {
          dialogIsOpen: { $set: action.payload },
        }),
      [ActionTypes.APPLY_FILTERS]: (state: any, action: any) => {
        const bigquery = new BigQuery();
        const { filters, dataset } = action.payload;

        const filterStatement = bigquery.buildSnapshotFilterStatement(filters, dataset);

        return immutable(state, {
          snapshotRequest: { filterStatement: { $set: filterStatement } },
        });
      },
      [ActionTypes.SNAPSHOT_CREATE_DETAILS]: (state: any, action: any) => {
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
      [ActionTypes.ADD_READERS_TO_SNAPSHOT]: (state: any, action: any) => {
        const snapshotRequest = { ...state.snapshotRequest, readers: action.payload };
        return immutable(state, {
          snapshotRequest: { $set: snapshotRequest },
        });
      },
      [LOCATION_CHANGE]: (state: any) =>
        immutable(state, {
          snapshotRequest: { $set: defaultSnapshotRequest },
        }),
      [ActionTypes.USER_LOGOUT]: () => initialSnapshotState,
    },
    initialSnapshotState,
  ),
};
