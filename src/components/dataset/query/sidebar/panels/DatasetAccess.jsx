import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import UserList from '../../../../UserList';
import { DATASET_ROLES } from '../../../../../constants';
import { getRoleMembersFromPolicies } from '../../../../../libs/utils';
import { addDatasetPolicyMember, removeDatasetPolicyMember } from '../../../../../actions';

const styles = (theme) => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
  },
  learnMore: {
    ...theme.mixins.jadeLink,
    cursor: 'pointer',
    textDecorationLine: 'underline',
  },
});

const helpTitle = (
  <Typography variant="h4">Roles and memberships in Terra Data Repository</Typography>
);

const helpContent = (
  <Fragment>
    <Typography variant="h6">Stewards</Typography>
    <Typography>
      Creating a dataset makes a user the Steward (or owner) of it. The steward of a dataset can:
    </Typography>
    <ul>
      <li>Define the schema for a dataset</li>
      <li>Delete a dataset (need to delete any resources leveraging the dataset first)</li>
      <li>Assign new stewards, custodians and snapshot creators of a dataset</li>
      <li>Add file/metadata to a dataset</li>
      <li>Soft delete data (a function that hides data rather than permanently deletes it)</li>
      <li>Read all the data in a dataset</li>
      <li>Create a snapshot from a dataset</li>
      <li>List all the stewards, custodians and snapshot creators of a dataset</li>
    </ul>
    <Typography variant="h6">Custodians</Typography>
    <Typography>
      A Steward can assign a Custodian to a dataset. The custodian of a dataset can:
    </Typography>
    <ul>
      <li>Add file/metadata to a dataset</li>
      <li>Soft delete data (a function that hides data rather than permanently deletes it)</li>
      <li>Read all the data in a dataset</li>
      <li>Create a snapshot from a dataset</li>
      <li>List all the stewards, custodians and snapshot creators of a dataset</li>
    </ul>
    <Typography variant="h6">Snapshot Creator</Typography>
    <Typography>
      A Steward can assign a Snapshot Creator to a dataset. The Snapshot Creator of a dataset can:
    </Typography>
    <ul>
      <li>Read all the data in a dataset</li>
      <li>Create a snapshot from a dataset</li>
      <li>List all the stewards, custodians and snapshot creators of a dataset</li>
    </ul>
  </Fragment>
);

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
  const { classes, helpOverlayToggle, policies, userRoles } = props;
  const helpOverlayToggleWithContent = () => helpOverlayToggle(helpTitle, helpContent);

  const stewards = getRoleMembersFromPolicies(policies, DATASET_ROLES.STEWARD);
  const custodians = getRoleMembersFromPolicies(policies, DATASET_ROLES.CUSTODIAN);
  const snapshotCreators = getRoleMembersFromPolicies(policies, DATASET_ROLES.SNAPSHOT_CREATOR);

  const canManageUsers = userRoles.includes(DATASET_ROLES.STEWARD);

  return (
    <div className={classes.root}>
      <div>
        <Link className={classes.learnMore} onClick={helpOverlayToggleWithContent}>
          Learn more
        </Link>
        &nbsp; about roles and memberships
      </div>
      <UserList
        users={stewards}
        typeOfUsers="Stewards"
        canManageUsers={canManageUsers}
        addUser={addUser(DATASET_ROLES.STEWARD)}
        removeUser={removeUser(DATASET_ROLES.STEWARD)}
      />
      <UserList
        users={custodians}
        typeOfUsers="Custodians"
        canManageUsers={canManageUsers}
        addUser={addUser(DATASET_ROLES.CUSTODIAN)}
        removeUser={removeUser(DATASET_ROLES.CUSTODIAN)}
      />
      <UserList
        users={snapshotCreators}
        typeOfUsers="Snapshot Creators"
        canManageUsers={canManageUsers}
        addUser={addUser(DATASET_ROLES.SNAPSHOT_CREATOR)}
        removeUser={removeUser(DATASET_ROLES.SNAPSHOT_CREATOR)}
      />
    </div>
  );
}

DatasetAccess.propTypes = {
  classes: PropTypes.object,
  dataset: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  helpOverlayToggle: PropTypes.func,
  policies: PropTypes.arrayOf(PropTypes.object).isRequired,
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
