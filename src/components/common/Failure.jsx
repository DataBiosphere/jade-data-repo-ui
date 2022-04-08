import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';

import { ReactComponent as ErrorIcon } from 'media/icons/warning-standard-solid.svg';

const styles = (theme) => ({
  text: {
    alignSelf: 'center',
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: 600,
    padding: `0 0 0 ${theme.spacing(2)}px`,
  },
  icon: {
    fill: theme.palette.primary.contrastText,
    height: theme.spacing(4),
  },
});

function Failure({ errString, classes }) {
  return (
    <div>
      <ErrorIcon className={classes.icon} alt="logo" />
      <div className={classes.text}>{errString}</div>
    </div>
  );
}

Failure.propTypes = {
  classes: PropTypes.object.isRequired,
  errString: PropTypes.string,
};

export default withStyles(styles)(Failure);
