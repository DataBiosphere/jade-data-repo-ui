import React, { Dispatch } from 'react';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { AuthContextProps, useAuth } from 'react-oidc-context';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { CustomTheme } from '@mui/material/styles';

import { logIn } from '../../actions';

const styles = (theme: CustomTheme) =>
  createStyles({
    root: {
      padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
      fontWeight: '600',
      fontSize: '16px',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  dispatch: Dispatch<Action<AuthContextProps>>;
}

function LoginButton({ classes, dispatch }: IProps) {
  const auth = useAuth();
  return (
    <Button
      onClick={() => dispatch(logIn(auth))}
      variant="contained"
      color="primary"
      disableElevation
      className={classes.root}
    >
      Login
    </Button>
  );
}

export default connect(() => ({}))(withStyles(styles)(LoginButton));
