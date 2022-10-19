import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { Grid } from '@mui/material';
import UserList from '../UserList';
import { SnapshotRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import { addSnapshotPolicyMember, removeSnapshotPolicyMember } from '../../actions';
import { PolicyModel, SnapshotModel } from '../../generated/tdr';
import { TdrState } from '../../reducers';
import { AppDispatch } from '../../store';

const styles = () => ({
  helpContainer: {
    padding: '30px 0 10px',
  },
});

type SnapshotAccessProps = {
  dispatch: AppDispatch;
  horizontal: boolean;
  isAddingOrRemovingUser: boolean;
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
  const { horizontal, policies, userRoles, isAddingOrRemovingUser } = props;
  const stewards = getRoleMembersFromPolicies(policies, SnapshotRoles.STEWARD);
  const readers = getRoleMembersFromPolicies(policies, SnapshotRoles.READER);
  const discoverers = getRoleMembersFromPolicies(policies, SnapshotRoles.DISCOVERER);

  const canManageUsers = userRoles.includes(SnapshotRoles.STEWARD);
  const gridItemXs = horizontal ? 4 : 12;

  return (
    <Grid container spacing={1}>
      <Grid item xs={gridItemXs} data-cy="snapshot-stewards">
        <UserList
          users={stewards}
          typeOfUsers="Stewards"
          canManageUsers={canManageUsers}
          addUser={addUser(SnapshotRoles.STEWARD)}
          isAddingOrRemovingUser={isAddingOrRemovingUser}
          removeUser={removeUser(SnapshotRoles.STEWARD)}
          defaultOpen={true}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs} data-cy="snapshot-readers">
        <UserList
          users={readers}
          typeOfUsers="Readers"
          canManageUsers={canManageUsers}
          addUser={addUser(SnapshotRoles.READER)}
          isAddingOrRemovingUser={isAddingOrRemovingUser}
          removeUser={removeUser(SnapshotRoles.READER)}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs} data-cy="snapshot-discoverers">
        <UserList
          users={discoverers}
          typeOfUsers="Discoverers"
          canManageUsers={canManageUsers}
          addUser={addUser(SnapshotRoles.DISCOVERER)}
          isAddingOrRemovingUser={isAddingOrRemovingUser}
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
    isAddingOrRemovingUser: state.snapshots.isAddingOrRemovingUser,
    snapshot: state.snapshots.snapshot,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotAccess));
