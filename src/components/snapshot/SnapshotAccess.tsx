import React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@mui/material';
import UserList from '../UserList';
import { SnapshotRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import { addSnapshotPolicyMember, removeSnapshotPolicyMember } from '../../actions';
import { PolicyModel, SnapshotModel } from '../../generated/tdr';
import { TdrState } from '../../reducers';
import { AppDispatch } from '../../store';

type SnapshotAccessProps = {
  dispatch: AppDispatch;
  horizontal: boolean;
  policies: Array<PolicyModel>;
  snapshot: SnapshotModel;
  userRoles: Array<string>;
};

function SnapshotAccess(props: SnapshotAccessProps) {
  const addUser = (role: string) => {
    const { snapshot, dispatch } = props;
    return (newEmail: string) => {
      dispatch(addSnapshotPolicyMember(snapshot.id, newEmail, role));
    };
  };
  const removeUser = (role: string) => {
    const { snapshot, dispatch } = props;
    return (removableEmail: string) => {
      dispatch(removeSnapshotPolicyMember(snapshot.id, removableEmail, role));
    };
  };
  const { horizontal, policies, userRoles } = props;
  const stewards = getRoleMembersFromPolicies(policies, SnapshotRoles.STEWARD);
  const readers = getRoleMembersFromPolicies(policies, SnapshotRoles.READER);
  const discoverers = getRoleMembersFromPolicies(policies, SnapshotRoles.DISCOVERER);

  const canManageUsers = userRoles.includes(SnapshotRoles.STEWARD);
  const gridItemXs = horizontal ? 4 : 12;

  return (
    <Grid container spacing={1}>
      <Grid item xs={gridItemXs}>
        <UserList
          users={stewards}
          typeOfUsers="Stewards"
          canManageUsers={canManageUsers}
          addUser={addUser(SnapshotRoles.STEWARD)}
          removeUser={removeUser(SnapshotRoles.STEWARD)}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs}>
        <UserList
          users={readers}
          typeOfUsers="Readers"
          canManageUsers={canManageUsers}
          addUser={addUser(SnapshotRoles.READER)}
          removeUser={removeUser(SnapshotRoles.READER)}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs}>
        <UserList
          users={discoverers}
          typeOfUsers="Discoverers"
          canManageUsers={canManageUsers}
          addUser={addUser(SnapshotRoles.DISCOVERER)}
          removeUser={removeUser(SnapshotRoles.DISCOVERER)}
          horizontal={horizontal}
        />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    policies: state.snapshots.snapshotPolicies,
    snapshot: state.snapshots.snapshot,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(SnapshotAccess);
