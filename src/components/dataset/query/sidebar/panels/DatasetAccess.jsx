import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';
import UserList from '../../../../UserList';
import { DATASET_ROLES } from '../../../../../constants';
import { getRoleMembersFromPolicies } from '../../../../../libs/utils';

const styles = (theme) => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
  },
  paperBody: {
    padding: theme.spacing(2),
  },
  headerText: {
    fontSize: '14px',
    lineHeight: '22px',
    fontWeight: '600',
    marginTop: theme.spacing(3),
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
    helpOverlayToggle: PropTypes.func,
    policies: PropTypes.arrayOf(PropTypes.object),
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
    const { classes, helpOverlayToggle, policies } = this.props;
    const helpOverlayToggleWithContent = () =>
      helpOverlayToggle(DatasetAccess.helpTitle, DatasetAccess.helpContent);

    const stewards = getRoleMembersFromPolicies(policies, DATASET_ROLES.STEWARD);
    const custodians = getRoleMembersFromPolicies(policies, DATASET_ROLES.CUSTODIAN);
    const snapshotCreators = getRoleMembersFromPolicies(policies, DATASET_ROLES.SNAPSHOT_CREATOR);

    return (
      <div className={classes.root}>
        <div>
          <Link className={classes.blueLink} onClick={helpOverlayToggleWithContent}>
            Learn more
          </Link>
          &nbsp; about roles and memberships
        </div>
        <UserList users={custodians} typeOfUsers="Stewards" canManageUsers={false} />
        <UserList users={stewards} typeOfUsers="Custodians" canManageUsers={false} />
        <UserList users={snapshotCreators} typeOfUsers="Snapshot Creators" canManageUsers={false} />
      </div>
    );
  }
}

export default withStyles(styles)(DatasetAccess);
