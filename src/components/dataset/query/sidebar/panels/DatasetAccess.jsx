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
  blueLink: {
    color: theme.palette.common.link,
    colorPrimary: theme.palette.common.link,
    cursor: 'pointer',
  },
});

export class DatasetAccess extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    helpOverlayToggle: PropTypes.func,
    policies: PropTypes.arrayOf(PropTypes.object).isRequired,
    userEmail: PropTypes.string.isRequired,
  };

  addUser = (role) => {
    const { dataset, dispatch } = this.props;
    return (newEmail) => {
      dispatch(addDatasetPolicyMember(dataset.id, newEmail, role));
    };
  };

  removeUser = (role) => {
    const { dataset, dispatch } = this.props;
    return (removableEmail) => {
      dispatch(removeDatasetPolicyMember(dataset.id, removableEmail, role));
    };
  };

  static helpTitle = (
    <Typography variant="h4">Roles and memberships in Terra Data Repository</Typography>
  );

  static helpContent = (
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

  render() {
    const { classes, helpOverlayToggle, policies, userEmail } = this.props;
    const helpOverlayToggleWithContent = () =>
      helpOverlayToggle(DatasetAccess.helpTitle, DatasetAccess.helpContent);

    const stewards = getRoleMembersFromPolicies(policies, DATASET_ROLES.STEWARD);
    const custodians = getRoleMembersFromPolicies(policies, DATASET_ROLES.CUSTODIAN);
    const snapshotCreators = getRoleMembersFromPolicies(policies, DATASET_ROLES.SNAPSHOT_CREATOR);

    const canManageUsers = stewards.some((email) => email === userEmail);

    return (
      <div className={classes.root}>
        <div>
          <Link className={classes.blueLink} onClick={helpOverlayToggleWithContent}>
            Learn more
          </Link>
          &nbsp; about roles and memberships
        </div>
        <UserList
          users={custodians}
          typeOfUsers="Stewards"
          canManageUsers={canManageUsers}
          addUser={this.addUser(DATASET_ROLES.STEWARD)}
          removeUser={this.removeUser(DATASET_ROLES.STEWARD)}
        />
        <UserList
          users={stewards}
          typeOfUsers="Custodians"
          canManageUsers={canManageUsers}
          addUser={this.addUser(DATASET_ROLES.CUSTODIAN)}
          removeUser={this.removeUser(DATASET_ROLES.CUSTODIAN)}
        />
        <UserList
          users={snapshotCreators}
          typeOfUsers="Snapshot Creators"
          canManageUsers={canManageUsers}
          addUser={this.addUser(DATASET_ROLES.SNAPSHOT_CREATOR)}
          removeUser={this.removeUser(DATASET_ROLES.SNAPSHOT_CREATOR)}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    policies: state.datasets.datasetPolicies,
    userEmail: state.user.email,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetAccess));
