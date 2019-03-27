import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';

import Hero from 'assets/media/images/hero.png';
import { logOut, logIn } from 'actions/index';

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing.unit * 8,
  },
  mainContent: {
    display: 'inline-block',
    color: theme.typography.color,
    overflow: 'hidden',
    padding: theme.spacing.unit * 10,
    width: '60%',
  },
  newUser: {
    color: theme.palette.secondary.contrastText,
    fontSize: '18px',
    fontWeight: '300',
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 8,
  },
  terraLink: {
    color: theme.palette.primary.main,
    paddingBottom: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit * 2,
    textDecoration: 'none',
  },
  header: {
    fontSize: '28px',
    lineHeight: '36px',
  },
  heroContainer: {
    display: 'inline-block',
  },
  hero: {
    width: '500px',
  },
  warning: {
    fontWeight: '900',
    paddingBottom: theme.spacing.unit * 2,
  },
});

class WelcomeView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { classes, dispatch } = this.props;

    const onSignInFailure = () => {
      dispatch(logOut());
    };

    const onSignInSuccess = user => {
      const name = user.profileObj && user.profileObj.name;
      const image = user.profileObj && user.profileObj.imageUrl;
      const token = user.tokenObj && user.tokenObj.id_token;
      const tokenExpiration = user.tokenObj && user.tokenObj.expires_at; // TODO how can we refresh this when it expires
      dispatch(logIn(name, image, token, tokenExpiration));
    };

    return (
      <div className={classes.container}>
        <div className={classes.mainContent}>
          <div className={classes.title}>Welcome to the Jade Data Repository</div>
          <div>
            <GoogleLogin // TODO this component may be unuseable once we require a terra registration
              clientId="694017244717-j5a5b7sebsvhd2u9ls85cinima96c2p0.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={onSignInSuccess}
              onFailure={onSignInFailure}
              isSignedIn
              cookiePolicy="single_host_origin"
              prompt="select_account"
              scope="openid profile email"
              theme="dark"
            />
          </div>
          <div className={classes.newUser}>New User?</div>
          <div className={classes.header}>Jade Data Repository requires a Google account.</div>
          <p>
            Terra uses your Google account. Once you have signed in and completed the user profile
            registration step, you can start using Terra.
          </p>
          <div href="https://app.terra.bio/" className={classes.terraLink}>
            Need to create a Terra account?
          </div>
          <hr />
          <div>
            <div>
              <div className={classes.warning}>WARNING NOTICE</div>
              <div>
                <p>
                  You are accessing a US Government web site which may contain information that must
                  be protected under the US Privacy Act or other sensitive information and is
                  intended Government authorized use only.
                </p>
                <p>
                  Unauthorized attempts to upload information, change information, or use of this
                  web site may result in disciplinary action, civil, and/or criminal penalties.
                  Unauthorized users of this website should have no expectation of privacy regarding
                  any communications or data processed by this website.
                </p>
                <p>
                  Anyone accessing this website expressly consents to monitoring of their actions
                  and all communications or data transiting or stored on related to this website and
                  is advised that if such monitoring reveals possible evidence of criminal activity,
                  NIH may provide that evidence to law enforcement officials.
                </p>
                <p>WARNING NOTICE (when accessing TCGA controlled data)</p>
                <p>
                  You are reminded that when accessing TCGA controlled accessinformation you are
                  bound by the dbGaP TCGA DATA USE CERTIFICATION AGREEMENT (DUCA).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.heroContainer}>
          <img src={Hero} alt="hero" className={classes.hero} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(WelcomeView);
