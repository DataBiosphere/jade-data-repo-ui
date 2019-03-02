import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';

import { logOut, logIn } from 'actions/index';

const styles = theme => ({
  mainContent: {
    padding: theme.spacing.unit * 3,
  },
});


class WelcomeView extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  render() {
    const onSignInFailure = () => {
      const { dispatch } = this.props;
      dispatch(logOut());
    };

    const onSignInSuccess = () => {
      const { dispatch } = this.props;
      dispatch(logIn());
    };
    const { classes } = this.props;

    return (
      <div className={classes.mainContent}>
        <h1>Welcome to the Jade Data Repository</h1>
        <div>
          <GoogleLogin // stealing clientId from Terra
            clientId="500025638838-s2v23ar3spugtd5t2v1vgfa2sp7ppg0d.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={onSignInSuccess}
            onFailure={onSignInFailure}
            theme="dark"
          />
        </div>

        <h3>New User?</h3>
        <h3>Jade Data Repository requires a  Google account.</h3>
        <p>
          Terra uses your Google account. Once you have signed in and completed the user profile registration step, you can start using Terra.
        </p>
        <a href="https://app.terra.bio/">Need to create a Terra account?</a>
        <hr />

        <div>
          <div>
            <div>WARNING NOTICE</div>
            <div>
              You are accessing a US Government web site which may contain information that must be protected under the US Privacy Act or other sensitive information and is intended for Government authorized use only.

              Unauthorized attempts to upload information, change information, or use of this web site may result in disciplinary action, civil, and/or criminal penalties. Unauthorized users of this website should have no expectation of privacy regarding any communications or data processed by this website.

              Anyone accessing this website expressly consents to monitoring of their actions and all communications or data transiting or stored on related to this website and is advised that if such monitoring reveals possible evidence of criminal activity, NIH may provide that evidence to law enforcement officials.

              WARNING NOTICE (when accessing TCGA controlled data)

              You are reminded that when accessing TCGA controlled access information you are bound by the dbGaP TCGA DATA USE CERTIFICATION AGREEMENT (DUCA).
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WelcomeView);
