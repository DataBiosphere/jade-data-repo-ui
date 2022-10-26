import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import UserList from '../UserList';
import { SnapshotRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import { addSnapshotPolicyMember, removeSnapshotPolicyMember } from '../../actions';
import { PolicyModel, SnapshotModel } from '../../generated/tdr';
import { TdrState } from '../../reducers';
import { AppDispatch } from '../../store';
import AddUserAccess, { AccessPermission } from '../common/AddUserAccess';

const styles = () => ({
  helpContainer: {
    padding: '30px 0 10px',
  },
});

type SnapshotAccessProps = {
  dispatch: AppDispatch;
  policies: Array<PolicyModel>;
  snapshot: SnapshotModel;
  userRoles: Array<string>;
};

function SnapshotAccess(props: SnapshotAccessProps) {
  const addUsers = (role: string, usersToAdd: string[]) => {
    const { snapshot, dispatch } = props;
    usersToAdd.forEach((user) => {
      dispatch(addSnapshotPolicyMember(snapshot.id, user, role));
    });
  };
  const removeUser = (role: string) => {
    const { snapshot, dispatch } = props;
    return (removableEmail: string) => {
      dispatch(removeSnapshotPolicyMember(snapshot.id, removableEmail, role));
    };
  };

  const { policies, userRoles } = props;
  const stewards = getRoleMembersFromPolicies(policies, SnapshotRoles.STEWARD);
  const readers = getRoleMembersFromPolicies(policies, SnapshotRoles.READER);
  const discoverers = getRoleMembersFromPolicies(policies, SnapshotRoles.DISCOVERER);

  const canManageUsers = userRoles.includes(SnapshotRoles.STEWARD);
  const permissions: AccessPermission[] = [
    { policy: 'steward', disabled: !canManageUsers },
    { policy: 'reader', disabled: !canManageUsers },
    { policy: 'discoverer', disabled: !canManageUsers },
  ];

  return (
    <Grid container spacing={1}>
      {canManageUsers && (
        <Grid item xs={12}>
          <AddUserAccess permissions={permissions} onAdd={addUsers} />
        </Grid>
      )}
      <Grid item xs={12} data-cy="snapshot-stewards">
        <UserList
          users={stewards}
          typeOfUsers="Stewards"
          canManageUsers={canManageUsers}
          removeUser={removeUser(SnapshotRoles.STEWARD)}
          defaultOpen={true}
        />
      </Grid>
      <Grid item xs={12} data-cy="snapshot-readers">
        <UserList
          users={readers}
          typeOfUsers="Readers"
          canManageUsers={canManageUsers}
          removeUser={removeUser(SnapshotRoles.READER)}
        />
      </Grid>
      <Grid item xs={12} data-cy="snapshot-discoverers">
        <UserList
          users={discoverers}
          typeOfUsers="Discoverers"
          canManageUsers={canManageUsers}
          removeUser={removeUser(SnapshotRoles.DISCOVERER)}
        />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    policies: state.snapshots.snapshotPolicies,
    isAddingOrRemovingUser: state.snapshots.isAddingOrRemovingUser,
    snapshot: state.snapshots.snapshot,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotAccess));
