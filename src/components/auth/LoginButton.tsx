import React, { Dispatch } from 'react';
import { createStyles, withStyles, WithStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { AuthContextProps, useAuth } from 'react-oidc-context';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';

import { logIn } from '../../actions';

const styles = () => createStyles({});

interface IProps extends WithStyles<typeof styles> {
  dispatch: Dispatch<Action<AuthContextProps>>;
}

function LoginButton({ dispatch }: IProps) {
  const auth = useAuth();
  return (
    <Button
      onClick={() => dispatch(logIn(auth))}
      variant="contained"
      color="primary"
      disableElevation
    >
      Login
    </Button>
  );
}

export default connect(() => ({}))(withStyles(styles)(LoginButton));
