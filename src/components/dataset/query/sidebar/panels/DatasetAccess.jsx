import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import UserList from '../../../../UserList';

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
      </Typography>
      <Typography variant="h6">Custodians</Typography>
      <Typography>
        A Steward can assign a Custodian to a dataset. The custodian of a dataset can:
        <ul>
          <li>Add file/metadata to a dataset</li>
          <li>Soft delete data (a function that hides data rather than permanently deletes it)</li>
          <li>Read all the data in a dataset</li>
          <li>Create a snapshot from a dataset</li>
          <li>List all the stewards, custodians and snapshot creators of a dataset</li>
        </ul>
      </Typography>
      <Typography variant="h6">Snapshot Creator</Typography>
      <Typography>
        A Steward can assign a Snapshot Creator to a dataset. The Snapshot Creator of a dataset can:
        <ul>
          <li>Read all the data in a dataset</li>
          <li>Create a snapshot from a dataset</li>
          <li>List all the stewards, custodians and snapshot creators of a dataset</li>
        </ul>
      </Typography>
    </Fragment>
  );

  render() {
    const { classes, helpOverlayToggle, policies } = this.props;
    const helpOverlayToggleWithContent = () =>
      helpOverlayToggle(DatasetAccess.helpTitle, DatasetAccess.helpContent);

    const custodiansObj = policies.find((policy) => policy.name === 'custodian');
    const custodians = (custodiansObj && custodiansObj.members) || [];
    const snapshotCreatorsObj = policies.find((policy) => policy.name === 'snapshot_creator');
    const snapshotCreators = (snapshotCreatorsObj && snapshotCreatorsObj.members) || [];
    const stewardsObj = policies.find((policy) => policy.name === 'steward');
    const stewards = (stewardsObj && stewardsObj.members) || [];

    return (
      <div className={classes.root}>
        <div>
          <Link href="#" className={classes.blueLink} onClick={helpOverlayToggleWithContent}>
            Learn more
          </Link>{' '}
          about roles and memberships
        </div>
        <UserList users={custodians} typeOfUsers="Stewards" canManageUsers={false} />
        <UserList users={stewards} typeOfUsers="Custodians" canManageUsers={false} />
        <UserList users={snapshotCreators} typeOfUsers="Snapshot Creators" canManageUsers={false} />
      </div>
    );
  }
}

export default withStyles(styles)(DatasetAccess);
