import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';

const styles = () => ({
  root: {
    padding: '1rem',
  },
  name: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  description: {
    paddingTop: '1rem',
  },
});

const SnapshotInfoCard = ({ classes, snapshot }) => (
  <Paper className={classes.root} elevation={4}>
    <Tooltip title={snapshot.name}>
      <Typography variant="h4" className={classes.name}>
      {snapshot.name}
      </Typography>
    </Tooltip>
    <Typography>Created on {snapshot.createdDate}</Typography>
    <Typography className={classes.description}>{snapshot.description}</Typography>
  </Paper>
);

SnapshotInfoCard.propTypes = {
  classes: PropTypes.object,
  snapshot: PropTypes.object,
};

export default withStyles(styles)(SnapshotInfoCard);
