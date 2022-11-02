import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import BigQuery from 'modules/bigquery';
import { LOCATION_CHANGE } from 'connected-react-router';

import { ActionTypes } from '../constants';
import {
  DatasetModel,
  InaccessibleWorkspacePolicyModel,
  PolicyModel,
  SnapshotExportResponseModel,
  SnapshotModel,
  SnapshotRequestModelPolicies,
  SnapshotSummaryModel,
  WorkspacePolicyModel,
} from '../generated/tdr';

// TODO: convert to autogenned SnapshotRequestModel
export interface SnapshotRequest {
  name: string;
  description: string;
  assetName: string;
  filterStatement: string;
  joinStatement: string;
  policies: SnapshotRequestModelPolicies;
}

export interface SnapshotState {
  snapshot: SnapshotModel;
  snapshots: Array<SnapshotSummaryModel>;
  snapshotRoleMaps: { [key: string]: Array<string> };
  snapshotPolicies: Array<PolicyModel>;
  snapshotWorkspaces: Array<WorkspacePolicyModel>;
  snapshotInaccessibleWorkspaces: Array<InaccessibleWorkspacePolicyModel>;
  canReadPolicies: boolean;
  dataset: DatasetModel;
  snapshotCount: number;
  filteredSnapshotCount: number;
  dialogIsOpen: boolean;
  loading: boolean;
  snapshotWorkspaceManagerEditInProgress: boolean;
  // for snapshot creation
  snapshotRequest: SnapshotRequest;
  userRoles: Array<string>;
  // for snapshot export to workspace
  exportIsProcessing: boolean;
  exportIsDone: boolean;
  exportResponse: SnapshotExportResponseModel;
  refreshCnt: number;
  isAddingOrRemovingUser: boolean;
}

const defaultSnapshotRequest: SnapshotRequest = {
  name: '',
  description: '',
  assetName: '',
  filterStatement: '',
  joinStatement: '',
  policies: {},
};

export const initialSnapshotState: SnapshotState = {
  snapshot: {},
  snapshots: [],
  snapshotRoleMaps: {},
  snapshotPolicies: [],
  snapshotWorkspaces: [],
  snapshotInaccessibleWorkspaces: [],
  canReadPolicies: false,
  dataset: {},
  snapshotCount: 0,
  filteredSnapshotCount: 0,
  dialogIsOpen: false,
  loading: false,
  snapshotWorkspaceManagerEditInProgress: false,
  // for snapshot creation
  snapshotRequest: defaultSnapshotRequest,
  userRoles: [],
  // for snapshot export to workspace
  exportIsProcessing: false,
  exportIsDone: false,
  exportResponse: {},
  refreshCnt: 0,
  isAddingOrRemovingUser: false,
};

// We need this method to apply the response from add/remove snapshot members since the API only returns the affected group
const snapshotMembershipResultApply = (action: any) => (
  snapshotPolicies: Array<PolicyModel>,
): Array<PolicyModel> =>
  snapshotPolicies.map((p) => {
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
      [ActionTypes.GET_SNAPSHOTS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_SNAPSHOTS_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.GET_SNAPSHOTS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          snapshots: { $set: action.snapshots.data.data.items },
          snapshotRoleMaps: { $set: action.snapshots.data.data.roleMap },
          snapshotCount: { $set: action.snapshots.data.data.total },
          filteredSnapshotCount: { $set: action.snapshots.data.data.filteredTotal },
          loading: { $set: false },
        }),
      [ActionTypes.REFRESH_SNAPSHOTS]: (state) =>
        immutable(state, {
          refreshCnt: { $set: state.refreshCnt + 1 },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state) =>
        immutable(state, {
          snapshot: { $set: {} },
          dialogIsOpen: { $set: true },
        }),
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state, action: any) =>
        immutable(state, {
          snapshot: { $set: action.payload.jobResult },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.CREATE_SNAPSHOT_EXCEPTION]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_START]: (state) =>
        immutable(state, {
          exportIsProcessing: { $set: true },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_JOB]: (state) =>
        immutable(state, {
          exportResponse: { $set: {} },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_SUCCESS]: (state, action: any) =>
        immutable(state, {
          exportResponse: { $set: action.payload.jobResult },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: true },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_FAILURE]: (state) =>
        immutable(state, {
          exportResponse: { $set: {} },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_EXCEPTION]: (state) =>
        immutable(state, {
          exportResponse: { $set: {} },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.RESET_SNAPSHOT_EXPORT]: (state) =>
        immutable(state, {
          exportResponse: { $set: {} },
          exportIsProcessing: { $set: false },
          exportIsDone: { $set: false },
        }),
      [ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS]: (state, action: any) =>
        immutable(state, {
          snapshot: { $set: action.snapshot.data.data },
        }),
      [ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS]: (state, action: any) =>
        immutable(state, {
          snapshotPolicies: { $set: action.snapshot.data.data.policies },
          snapshotWorkspaces: { $set: action.snapshot.data.data.workspaces },
          snapshotInaccessibleWorkspaces: {
            $set: action.snapshot.data.data.inaccessibleWorkspaces,
          },
          snapshotWorkspaceManagerEditInProgress: { $set: false },
          canReadPolicies: { $set: true },
        }),
      [ActionTypes.GET_SNAPSHOT_POLICY_FAILURE]: (state) =>
        immutable(state, {
          snapshotPolicies: { $set: [] },
          snapshotWorkspaces: { $set: [] },
          snapshotInaccessibleWorkspaces: { $set: [] },
          snapshotWorkspaceManagerEditInProgress: { $set: false },
          canReadPolicies: { $set: false },
        }),
      [ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS]: (state, action: any) =>
        immutable(state, {
          snapshotPolicies: { $apply: snapshotMembershipResultApply(action) },
          snapshotWorkspaces: { $set: action.snapshot.data.data.workspaces },
          snapshotInaccessibleWorkspaces: {
            $set: action.snapshot.data.data.inaccessibleWorkspaces,
          },
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: true },
        }),
      [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: true },
        }),
      [ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_FAILURE]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER_FAILURE]: (state) =>
        immutable(state, {
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS]: (state, action: any) =>
        immutable(state, {
          snapshotPolicies: { $apply: snapshotMembershipResultApply(action) },
          snapshotWorkspaces: { $set: action.snapshot.data.data.workspaces },
          snapshotInaccessibleWorkspaces: {
            $set: action.snapshot.data.data.inaccessibleWorkspaces,
          },
          isAddingOrRemovingUser: { $set: false },
        }),
      [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBERS]: (state) =>
        immutable(state, { snapshotWorkspaceManagerEditInProgress: { $set: true } }),
      [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBERS_EXCEPTION]: (state) =>
        immutable(state, { snapshotWorkspaceManagerEditInProgress: { $set: false } }),
      [ActionTypes.GET_USER_SNAPSHOT_ROLES]: (state) =>
        immutable(state, {
          userRoles: { $set: [] },
        }),
      [ActionTypes.GET_USER_SNAPSHOT_ROLES_SUCCESS]: (state, action: any) =>
        immutable(state, {
          userRoles: { $set: action.roles.data },
        }),
      [ActionTypes.EXCEPTION]: (state) =>
        immutable(state, {
          dialogIsOpen: { $set: false },
        }),
      [ActionTypes.OPEN_SNAPSHOT_DIALOG]: (state, action: any) =>
        immutable(state, {
          dialogIsOpen: { $set: action.payload },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action: any) => {
        const bigquery = new BigQuery();
        const { filters, dataset } = action.payload;

        const filterStatement = bigquery.buildSnapshotFilterStatement(filters, dataset);

        return immutable(state, {
          snapshotRequest: { filterStatement: { $set: filterStatement } },
        });
      },
      [ActionTypes.SNAPSHOT_CREATE_DETAILS]: (state, action: any) => {
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
      [ActionTypes.CHANGE_POLICY_USERS_TO_SNAPSHOT_REQUEST]: (state, action: any) => {
        const { policy, users } = action.payload;
        const snapshotRequest = {
          ...state.snapshotRequest,
          policies: {
            ...state.snapshotRequest.policies,
            [policy]: users,
          },
        };
        return immutable(state, {
          snapshotRequest: { $set: snapshotRequest },
        });
      },
      [ActionTypes.PATCH_SNAPSHOT_SUCCESS]: (state, action: any) => {
        const snapshotObj: any = { snapshot: {} };
        if (action.data.consentCode !== undefined) {
          snapshotObj.snapshot.consentCode = { $set: action.data.consentCode };
        }
        if (action.data.description !== undefined) {
          snapshotObj.snapshot.description = { $set: action.data.description };
        }
        return immutable(state, snapshotObj);
      },
      [LOCATION_CHANGE]: (state) =>
        immutable(state, {
          snapshotRequest: { $set: defaultSnapshotRequest },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialSnapshotState,
    },
    initialSnapshotState,
  ),
};
