import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from '@mui/styles';
import { Grid, Typography } from '@mui/material';
import UserList from '../UserList';
import { SnapshotRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import {
  addSnapshotPolicyMember,
  removeSnapshotPolicyMember,
  changePolicyUsersToSnapshotRequest,
} from '../../actions';
import { PolicyModel, SnapshotModel } from '../../generated/tdr';
import { TdrState } from '../../reducers';
import { SnapshotRequest } from '../../reducers/snapshot';
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
  snapshotRequest: SnapshotRequest;
  userRoles: Array<string>;
  createMode?: boolean;
};

function SnapshotAccess({
  dispatch,
  policies,
  snapshot,
  snapshotRequest,
  userRoles,
  createMode,
}: SnapshotAccessProps) {
  const addUsers = (role: string, usersToAdd: string[]) => {
    if (createMode) {
      const existingEmails = _.get(snapshotRequest, ['policies', `${role}s`], []);
      const uniqEmails = _.uniq([...existingEmails, ...usersToAdd]);

      // needs this manual conversion because the permissions are different for
      // editing existing snapshot policies vs creating a new snapshot
      if (
        role === 'steward' ||
        role === 'reader' ||
        role === 'discoverer' ||
        role === 'aggregate_data_reader'
      ) {
        dispatch(changePolicyUsersToSnapshotRequest(`${role}s`, uniqEmails));
      }
    } else {
      usersToAdd.forEach((user) => {
        dispatch(addSnapshotPolicyMember(snapshot.id, user, role));
      });
    }
  };

  const removeUser = (role: string) => {
    if (createMode) {
      return (removeableEmail: string) => {
        const existingEmails = _.get(snapshotRequest, ['policies', `${role}s`], []);
        const filteredEmails = _.filter(existingEmails, (user: string) => user !== removeableEmail);
        dispatch(changePolicyUsersToSnapshotRequest(`${role}s`, filteredEmails));
      };
    }

    return (removableEmail: string) => {
      dispatch(removeSnapshotPolicyMember(snapshot.id, removableEmail, role));
    };
  };

  const getUsers = (role: string): string[] => {
    const pluralizedRole = `${role}s`;
    return createMode
      ? (snapshotRequest.policies as any)[pluralizedRole] || []
      : getRoleMembersFromPolicies(policies, role);
  };

  const stewards = getUsers(SnapshotRoles.STEWARD);
  const readers = getUsers(SnapshotRoles.READER);
  const discoverers = getUsers(SnapshotRoles.DISCOVERER);
  const aggregateDataReaders = getUsers(SnapshotRoles.AGGREGATE_DATA_READER);

  const canManageUsers = userRoles.includes(SnapshotRoles.STEWARD) || !!createMode;
  const permissions: AccessPermission[] = [
    { policy: 'steward', disabled: !canManageUsers },
    { policy: 'reader', disabled: !canManageUsers },
    { policy: 'discoverer', disabled: !canManageUsers },
    { policy: 'aggregate_data_reader', disabled: !canManageUsers },
  ];

  return (
    <Grid container spacing={1}>
      <Typography variant="h6">Roles</Typography>
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
        />
      </Grid>
      <Grid item xs={12} data-cy="snapshot-readers">
        <UserList
          users={readers}
          typeOfUsers="Readers"
          canManageUsers={canManageUsers}
          removeUser={removeUser(SnapshotRoles.READER)}
          defaultOpen={createMode}
        />
      </Grid>
      <Grid item xs={12} data-cy="snapshot-discoverers">
        <UserList
          users={discoverers}
          typeOfUsers="Discoverers"
          canManageUsers={canManageUsers}
          removeUser={removeUser(SnapshotRoles.DISCOVERER)}
          defaultOpen={createMode}
        />
      </Grid>
      <Grid item xs={12} data-cy="snapshot-aggregate-data-readers">
        <UserList
          users={aggregateDataReaders}
          typeOfUsers="Aggregate Data Readers"
          canManageUsers={canManageUsers}
          removeUser={removeUser(SnapshotRoles.AGGREGATE_DATA_READER)}
          defaultOpen={createMode}
        />
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    policies: state.snapshots.snapshotPolicies,
    snapshot: state.snapshots.snapshot,
    snapshotRequest: state.snapshots.snapshotRequest,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotAccess));
