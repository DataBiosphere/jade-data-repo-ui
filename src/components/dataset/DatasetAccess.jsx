import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@mui/material';
import { withStyles } from '@mui/styles';
import UserList from '../UserList';
import { DatasetRoles } from '../../constants';
import { getRoleMembersFromPolicies } from '../../libs/utils';
import { addDatasetPolicyMember, removeDatasetPolicyMember } from '../../actions';

const styles = (theme) => ({
  helpContainer: {
    padding: '30px 0 10px',
  },
  genericLink: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
  },
});

function DatasetAccess(props) {
  const addUser = (role) => {
    const { dataset, dispatch } = props;
    return (newEmail) => {
      dispatch(addDatasetPolicyMember(dataset.id, newEmail, role));
    };
  };
  const removeUser = (role) => {
    const { dataset, dispatch } = props;
    return (removableEmail) => {
      dispatch(removeDatasetPolicyMember(dataset.id, removableEmail, role));
    };
  };
  const { horizontal, policies, userRoles, showHelp, classes } = props;
  const stewards = getRoleMembersFromPolicies(policies, DatasetRoles.STEWARD);
  const custodians = getRoleMembersFromPolicies(policies, DatasetRoles.CUSTODIAN);
  const snapshotCreators = getRoleMembersFromPolicies(policies, DatasetRoles.SNAPSHOT_CREATOR);

  const canManageStewards = userRoles.includes(DatasetRoles.STEWARD);
  const canManageUsers =
    userRoles.includes(DatasetRoles.STEWARD) || userRoles.includes(DatasetRoles.CUSTODIAN);
  const gridItemXs = horizontal ? 4 : 12;

  return (
    <Grid container spacing={1} className="dataset-access-container">
      {showHelp ? (
        <Grid item xs={gridItemXs} className={classes.helpContainer}>
          <a href="#" className={classes.genericLink}>
            Learn more
          </a>{' '}
          about roles and memberships
        </Grid>
      ) : null}
      <Grid item xs={gridItemXs}>
        <UserList
          users={stewards}
          typeOfUsers="Stewards"
          canManageUsers={canManageStewards}
          addUser={addUser(DatasetRoles.STEWARD)}
          removeUser={removeUser(DatasetRoles.STEWARD)}
          horizontal={horizontal}
        />
      </Grid>
      <Grid item xs={gridItemXs}>
        <UserList
          users={custodians}
          typeOfUsers="Custodians"
          canManageUsers={canManageUsers}
          addUser={addUser(DatasetRoles.CUSTODIAN)}
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
          removeUser={removeUser(DatasetRoles.SNAPSHOT_CREATOR)}
          horizontal={horizontal}
        />
      </Grid>
    </Grid>
  );
}

DatasetAccess.propTypes = {
  classes: PropTypes.object,
  dataset: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
  policies: PropTypes.arrayOf(PropTypes.object).isRequired,
  showHelp: PropTypes.bool,
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    policies: state.datasets.datasetPolicies,
    userRoles: state.datasets.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetAccess));
