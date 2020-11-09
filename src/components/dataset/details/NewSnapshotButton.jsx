import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AddCircleOutline } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(77, 114, 170, .10)',
    border: '4px dashed #B8CBE7',
    '&:hover': {
      backgroundColor: 'rgba(77, 114, 170, .15)',
    },
    borderRadius: 5,
  },
  buttonInterior: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: theme.palette.common.link,
  },
  plusIcon: {
    fontSize: 80,
  },
});

const NewSnapshotButton = ({ classes, datasetId }) => {
  return (
    <Link to={`/datasets/${datasetId}/query`} className={classes.root}>
      <Button>
        <div className={classes.buttonInterior}>
          <AddCircleOutline className={classes.plusIcon} />
          <Typography variant="h6">New Snapshot</Typography>
        </div>
      </Button>
    </Link>
  );
};

export default withStyles(styles)(NewSnapshotButton);
