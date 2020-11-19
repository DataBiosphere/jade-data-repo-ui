import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const styles = () => ({
  root: {
    padding: '1rem',
  },
  description: {
    paddingTop: '1rem',
  },
});

const SnapshotInfoCard = ({ classes, snapshot }) => (
  <Paper className={classes.root} elevation={4}>
    <Typography variant="h4">{snapshot.name}</Typography>
    <Typography>Created on {snapshot.created}</Typography>
    <Typography className={classes.description}>{snapshot.description}</Typography>
  </Paper>
);

SnapshotInfoCard.propTypes = {
  classes: PropTypes.object,
  snapshot: PropTypes.object,
};

export default withStyles(styles)(SnapshotInfoCard);
