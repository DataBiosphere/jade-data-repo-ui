import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Error } from '@mui/icons-material';

const styles = (theme) => ({
  card: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.main,
    boxShadow: `-${theme.spacing(1)} 0 0 0 ${theme.palette.error.dark}`,
    color: theme.palette.primary.contrastText,
    width: '100%',
  },
  content: {
    display: 'flex',
  },
  cardBody: {
    display: 'flex',
  },
  text: {
    alignSelf: 'center',
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: 600,
    padding: `0 0 0 ${theme.spacing(2)}`,
  },
  icon: {
    fill: theme.palette.primary.contrastText,
    height: theme.spacing(4),
    width: theme.spacing(4),
  },
});

export class Toast extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    errorMsg: PropTypes.string,
    status: PropTypes.string,
  };

  render() {
    const { classes, errorMsg, status } = this.props;

    let errString;
    if (status && errorMsg) {
      errString = `Error ${status}: ${errorMsg}`;
    } else {
      errString = 'An error occurred, please try again or submit a bug report';
    }

    return (
      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <div className={classes.cardBody}>
            <Error className={classes.icon} alt="logo" />
            <div className={classes.text}>{errString}</div>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Toast);
