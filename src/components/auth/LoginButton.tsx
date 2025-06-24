import React, { Dispatch } from 'react';
import { Button } from '@mui/material';
import { AuthContextProps, useAuth } from 'react-oidc-context';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';

import { logIn } from '../../actions';

interface IProps {
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
      sx={{
        padding: (theme) => `${theme.spacing(2)} ${theme.spacing(4)}`,
        fontWeight: 600,
        fontSize: '16px',
      }}
    >
      Log in
    </Button>
  );
}

export default connect(() => ({}))(LoginButton);
