import { Grid, Typography } from '@mui/material';
import AddUserAccess, { AccessPermission } from 'components/common/AddUserAccess';
import UserList from 'components/UserList';
import React from 'react';
import { getRoleMembersFromPolicies } from 'libs/utils';
import _ from 'lodash';
import { PolicyModel, SnapshotRequestModelPolicies } from 'generated/tdr';
import { connect } from 'react-redux';
import { TdrState } from 'reducers';
import { SnapshotRoles } from 'constants';
import { styled } from '@mui/material/styles';

export const transformRoleToCreatePolicy = (role: string): string => `${_.camelCase(role)}s`;

const ManagedSnapshotAccessGrid = styled(Grid)(() => ({
  my: 1,
  width: '100%',
  marginLeft: '0',
  paddingRight: '8px',
}));

interface ManagedSnapshotAccessProps {
  readonly createMode: boolean;
  readonly addUsers: (role: string, usersToAdd: string[]) => void;
  readonly removeUser: (role: string) => (user: string) => void;
  readonly userRoles: string[];
  readonly policies: Array<PolicyModel>;
  readonly requestPolicies: SnapshotRequestModelPolicies;
}

function ManagedSnapshotAccess(props: ManagedSnapshotAccessProps) {
  const { createMode, addUsers, removeUser, userRoles, policies, requestPolicies } = props;

  const getUsers = (role: string): string[] =>
    createMode
      ? (requestPolicies as any)[transformRoleToCreatePolicy(role)] || []
      : getRoleMembersFromPolicies(policies, role);

  const stewards = getUsers(SnapshotRoles.STEWARD);
  const readers = getUsers(SnapshotRoles.READER);
  const discoverers = getUsers(SnapshotRoles.DISCOVERER);
  const aggregateDataReaders = getUsers(SnapshotRoles.AGGREGATE_DATA_READER);

  const canManageUsers = userRoles.includes(SnapshotRoles.STEWARD) || createMode;
  const permissions: AccessPermission[] = [
    { policy: 'steward', disabled: !canManageUsers },
    { policy: 'reader', disabled: !canManageUsers },
    { policy: 'discoverer', disabled: !canManageUsers },
    { policy: 'aggregate_data_reader', disabled: !canManageUsers },
  ];

  return (
    <ManagedSnapshotAccessGrid container spacing={1}>
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
          defaultOpen={createMode}
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
    </ManagedSnapshotAccessGrid>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    policies: state.snapshots.snapshotPolicies,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(ManagedSnapshotAccess);
