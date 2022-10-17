import React from 'react';
import { connect } from 'react-redux';
import { CustomTheme, Grid } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { TdrState } from 'reducers';
import { DatasetModel, PolicyModel } from 'generated/tdr';
import { Action, Dispatch } from 'redux';
import UserList from '../UserList';
import { DatasetRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import { addDatasetPolicyMember, removeDatasetPolicyMember } from '../../actions';

const styles = (theme: CustomTheme) =>
  createStyles({
    helpContainer: {
      padding: '30px 0 10px',
    },
    genericLink: {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  });

interface DatasetAccessProps extends WithStyles<typeof styles> {
  dataset: DatasetModel;
  dispatch: Dispatch<Action>;
  horizontal?: boolean;
  isAddingOrRemovingUser: boolean;
  policies: Array<PolicyModel>;
  userRoles: Array<string>;
}

function DatasetAccess(props: DatasetAccessProps) {
  const addUser = (role: string) => {
    const { dataset, dispatch } = props;
    return (newEmail: string) => {
      dispatch(addDatasetPolicyMember(dataset.id, newEmail, role));
    };
  };
  const removeUser = (role: string) => {
    const { dataset, dispatch } = props;
    return (removableEmail: string) => {
      dispatch(removeDatasetPolicyMember(dataset.id, removableEmail, role));
    };
  };
  const { horizontal, policies, userRoles, isAddingOrRemovingUser } = props;
  const stewards = getRoleMembersFromPolicies(policies, DatasetRoles.STEWARD);
  const custodians = getRoleMembersFromPolicies(policies, DatasetRoles.CUSTODIAN);
  const snapshotCreators = getRoleMembersFromPolicies(policies, DatasetRoles.SNAPSHOT_CREATOR);

  const canManageStewards = userRoles.includes(DatasetRoles.STEWARD);
  const canManageUsers =
    userRoles.includes(DatasetRoles.STEWARD) || userRoles.includes(DatasetRoles.CUSTODIAN);
  const gridItemXs = horizontal ? 4 : 12;

  return (
    <Grid container spacing={1} className="dataset-access-container">
      <Grid item xs={gridItemXs}>
        <UserList
          users={stewards}
          typeOfUsers="Stewards"
          canManageUsers={canManageStewards}
          addUser={addUser(DatasetRoles.STEWARD)}
          isAddingOrRemovingUser={isAddingOrRemovingUser}
          removeUser={removeUser(DatasetRoles.STEWARD)}
          defaultOpen={true}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs}>
        <UserList
          users={custodians}
          typeOfUsers="Custodians"
          canManageUsers={canManageUsers}
          addUser={addUser(DatasetRoles.CUSTODIAN)}
          isAddingOrRemovingUser={isAddingOrRemovingUser}
          removeUser={removeUser(DatasetRoles.CUSTODIAN)}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs}>
        <UserList
          users={snapshotCreators}
          typeOfUsers="Snapshot Creators"
          canManageUsers={canManageUsers}
          addUser={addUser(DatasetRoles.SNAPSHOT_CREATOR)}
          isAddingOrRemovingUser={isAddingOrRemovingUser}
          removeUser={removeUser(DatasetRoles.SNAPSHOT_CREATOR)}
          horizontal={horizontal}
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

export default connect(mapStateToProps)(withStyles(styles)(DatasetAccess));
