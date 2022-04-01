import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Grid, Link, Typography } from '@mui/material';
import { connect } from 'react-redux';
import DatasetAccess from '../../../DatasetAccess';

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

function InfoViewDatasetAccess(props) {
  const { classes, helpOverlayToggle } = props;
  const helpOverlayToggleWithContent = () => helpOverlayToggle(helpTitle, helpContent);

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div>
            <Link className={classes.learnMore} onClick={helpOverlayToggleWithContent}>
              Learn more
            </Link>
            &nbsp; about roles and memberships
          </div>
        </Grid>
      </Grid>
      <DatasetAccess horizontal={false} />
    </div>
  );
}

InfoViewDatasetAccess.propTypes = {
  classes: PropTypes.object,
  helpOverlayToggle: PropTypes.func,
};

export default connect()(withStyles(styles)(InfoViewDatasetAccess));
