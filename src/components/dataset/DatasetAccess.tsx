import React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@mui/material';
import { TdrState } from 'reducers';
import { DatasetModel, PolicyModel } from 'generated/tdr';
import { Action, Dispatch } from 'redux';
import UserList from '../UserList';
import { DatasetRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import { addDatasetPolicyMember, removeDatasetPolicyMember } from '../../actions';
import AddUserAccess, { AccessPermission } from '../common/AddUserAccess';

interface DatasetAccessProps {
  dataset: DatasetModel;
  dispatch: Dispatch<Action>;
  policies: Array<PolicyModel>;
  userRoles: Array<string>;
}

function DatasetAccess(props: DatasetAccessProps) {
  const addUsers = (role: string, usersToAdd: string[]) => {
    const { dataset, dispatch } = props;
    usersToAdd.forEach((user) => {
      dispatch(addDatasetPolicyMember(dataset.id, user, role));
    });
  };
  const removeUser = (role: string) => {
    const { dataset, dispatch } = props;
    return (removableEmail: string) => {
      dispatch(removeDatasetPolicyMember(dataset.id, removableEmail, role));
    };
  };
  const { dataset, policies, userRoles } = props;
  const stewards = getRoleMembersFromPolicies(policies, DatasetRoles.STEWARD);
  const custodians = getRoleMembersFromPolicies(policies, DatasetRoles.CUSTODIAN);
  const snapshotCreators = getRoleMembersFromPolicies(policies, DatasetRoles.SNAPSHOT_CREATOR);

  const canManageStewards = userRoles.includes(DatasetRoles.STEWARD);
  const canManageUsers =
    userRoles.includes(DatasetRoles.STEWARD) || userRoles.includes(DatasetRoles.CUSTODIAN);
  const message = dataset.inheritSteward
    ? 'All dataset custodians are stewards on all snapshots created from this dataset.'
    : undefined;

  const permissions: AccessPermission[] = [
    { policy: 'custodian', disabled: !canManageUsers },
    { policy: 'snapshot_creator', disabled: !canManageUsers },
    { policy: 'steward', disabled: !canManageStewards },
  ];

  return (
    <Grid container spacing={1} className="dataset-access-container">
      {canManageUsers && (
        <Grid item xs={12}>
          <AddUserAccess permissions={permissions} onAdd={addUsers} />
        </Grid>
      )}
      <Grid item xs={12}>
        <UserList
          users={stewards}
          typeOfUsers="Stewards"
          canManageUsers={canManageStewards}
          removeUser={removeUser(DatasetRoles.STEWARD)}
        />
      </Grid>
      <Grid item xs={12}>
        <UserList
          message={message}
          users={custodians}
          typeOfUsers="Custodians"
          canManageUsers={canManageUsers}
          removeUser={removeUser(DatasetRoles.CUSTODIAN)}
        />
      </Grid>
      <Grid item xs={12}>
        <UserList
          users={snapshotCreators}
          typeOfUsers="Snapshot Creators"
          canManageUsers={canManageUsers}
          removeUser={removeUser(DatasetRoles.SNAPSHOT_CREATOR)}
        />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    dataset: state.datasets.dataset,
    isAddingOrRemovingUser: state.datasets.isAddingOrRemovingUser,
    policies: state.datasets.datasetPolicies,
    userRoles: state.datasets.userRoles,
  };
}

export default connect(mapStateToProps)(DatasetAccess);
