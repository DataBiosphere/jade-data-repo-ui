import React from 'react';
import { makeStyles } from '@mui/styles';
import { CircularProgress } from '@mui/material';
import clsx from 'clsx';

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

type LoadingSpinnerProps = {
  className?: string;
  delay?: boolean;
  delayMessage?: string;
};

function LoadingSpinner({ className, delay, delayMessage }: LoadingSpinnerProps) {
  const classes = useStyles();
  return (
    <div className={clsx(className, classes.spinWrapper)}>
      <CircularProgress className={classes.spinner} />
      {delay && delayMessage}
    </div>
  );
}

export default LoadingSpinner;
