import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  root: {
    padding: '1rem',
  },
  description: {
    paddingTop: '1rem',
  },
});

const SnapshotInfoCard = ({ classes, snapshot }) => {
  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h4">{snapshot.name}</Typography>
      <Typography>Created on {snapshot.created}</Typography>
      <Typography className={classes.description}>{snapshot.description}</Typography>
    </Paper>
  );
};

export default withStyles(styles)(SnapshotInfoCard);
