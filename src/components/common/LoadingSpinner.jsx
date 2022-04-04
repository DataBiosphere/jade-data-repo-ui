import React from 'react';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  spinWrapper: {
    height: 'calc(100% - 60px)',
    display: 'grid',
    width: 500,
    textAlign: 'center',
    margin: 'auto',
  },
  spinner: {
    margin: 'auto',
  },
}));

function LoadingSpinner({ delay, delayMessage }) {
  const classes = useStyles();
  return (
    <div className={classes.spinWrapper}>
      <CircularProgress className={classes.spinner} />
      {delay && delayMessage}
    </div>
  );
}

LoadingSpinner.propTypes = {
  delay: PropTypes.bool,
  delayMessage: PropTypes.string,
};

export default LoadingSpinner;
