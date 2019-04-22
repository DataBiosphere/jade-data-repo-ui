import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';

import { hideAlert } from 'actions/index';
import ErrorIcon from '../../assets/media/icons/warning-standard-solid.svg';
import CloseIcon from '../../assets/media/icons/times-line.svg';

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
  closeButton: {
    fill: theme.palette.primary.contrastText,
    padding: theme.spacing.unit,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  close: {
    height: theme.spacing.unit * 2,
    width: theme.spacing.unit * 2,
  },
});

export class Toast extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
  };

  hideToast() {
    const { dispatch } = this.props;
    dispatch(hideAlert());
  }

  render() {
    const { classes, errorMsg } = this.props;
    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <ErrorIcon className={classes.icon} alt="logo" />
          <div className={classes.text}>
            {errorMsg || 'An error occurred, please try again or submit a bug report'}
          </div>
          <IconButton className={classes.closeButton} onClick={() => this.hideToast()}>
            <CloseIcon className={classes.close} />
          </IconButton>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Toast);
