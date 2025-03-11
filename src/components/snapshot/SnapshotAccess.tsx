import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ManagedSnapshotAccess, {
  transformRoleToCreatePolicy,
} from 'components/snapshot/ManagedSnapshotAccess';
import { SnapshotRoles } from '../../constants';
import {
  addSnapshotPolicyMember,
  removeSnapshotPolicyMember,
  changePolicyUsersToSnapshotRequest,
} from '../../actions';
import { SnapshotModel } from '../../generated/tdr';
import { TdrState } from '../../reducers';
import { SnapshotRequest } from '../../reducers/snapshot';
import { AppDispatch } from '../../store';

type SnapshotAccessProps = {
  readonly dispatch: AppDispatch;
  readonly snapshot: SnapshotModel;
  readonly snapshotRequest: SnapshotRequest;
  readonly createMode: boolean;
};

function SnapshotAccess({ dispatch, snapshot, snapshotRequest, createMode }: SnapshotAccessProps) {
  const addUsers = (role: string, usersToAdd: string[]) => {
    if (createMode) {
      const existingEmails = _.get(snapshotRequest, ['policies', `${role}s`], []);
      const uniqEmails = _.uniq([...existingEmails, ...usersToAdd]);

      // needs this manual conversion because the permissions are different for
      // editing existing snapshot policies vs creating a new snapshot
      // @ts-ignore role will always be a string, but because of the input not having more specific types, we need the ignore
      if (Object.values(SnapshotRoles).includes(role)) {
        dispatch(changePolicyUsersToSnapshotRequest(transformRoleToCreatePolicy(role), uniqEmails));
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
        dispatch(
          changePolicyUsersToSnapshotRequest(transformRoleToCreatePolicy(role), filteredEmails),
        );
      };
    }

    return (removableEmail: string) => {
      dispatch(removeSnapshotPolicyMember(snapshot.id, removableEmail, role));
    };
  };

  return (
    <ManagedSnapshotAccess
      createMode={createMode}
      addUsers={addUsers}
      removeUser={removeUser}
      requestPolicies={snapshotRequest?.policies}
    />
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

export default connect(mapStateToProps)(SnapshotAccess);
