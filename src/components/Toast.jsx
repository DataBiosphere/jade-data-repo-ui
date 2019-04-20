import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import ErrorIcon from '../../assets/media/icons/warning-standard-solid.svg';

const styles = theme => ({
  card: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.main,
    boxShadow: `${theme.spacing.unit * -1}px 0 0 0 ${theme.palette.error.dark}`,
    color: theme.palette.primary.contrastText,
    height: 65,
    width: 268,
    margin: theme.spacing.unit * 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  content: {
    display: 'flex',
  },
  text: {
    alignSelf: 'center',
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: 600,
    padding: `0 0 0 ${theme.spacing.unit * 2}px`,
  },
  icon: {
    fill: theme.palette.primary.contrastText,
    height: theme.spacing.unit * 4,
  },
  close: {
    color: theme.palette.primary.contrastText,
    fontFamily: theme.typography.fontFamily,
    position: 'absolute',
    right: theme.spacing.unit,
    top: 0,
  },
});

class Toast extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorMsg: PropTypes.string,
  };

  render() {
    const { classes, errorMsg } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <ErrorIcon className={classes.icon} alt="logo" />
          <div className={classes.text}>{errorMsg || 'WTF did you do?'}</div>
          <div className={classes.close}>x</div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Toast);
