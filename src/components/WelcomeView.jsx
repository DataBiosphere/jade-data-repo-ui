import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { renderLoginButton } from 'modules/auth';
import { withStyles } from '@material-ui/core/styles';
import { LaunchOutlined } from '@material-ui/icons';

import Hero from 'media/images/hero.png';
import LogoGrey from 'media/brand/logo-grey.svg';

import { logOut, logIn } from 'actions/index';

const styles = (theme) => ({
  containerWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: '54px',
    lineHeight: '54px',
    paddingBottom: theme.spacing(2),
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '20px',
    paddingBottom: theme.spacing(2),
  },
  mainContent: {
    display: 'inline-block',
    color: theme.typography.color,
    overflow: 'hidden',
    marginTop: theme.spacing(10),
    padding: theme.spacing(10),
    paddingRight: '500px',
    background: `url(${Hero})`,
    backgroundPositionX: 'right',
    backgroundPositionY: 'top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '750px',
  },
  newUser: {
    color: theme.palette.secondary.contrastText,
    fontSize: '18px',
    fontWeight: '300',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
  terraLink: {
    color: theme.palette.primary.main,
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(2),
    textDecoration: 'none',
  },
  header: {
    fontSize: '24px',
    lineHeight: '36px',
  },
  warning: {
    fontWeight: '900',
    paddingBottom: theme.spacing(2),
  },
  footer: {
    height: 60,
    width: '100%',
    background: 'rgb(109 110 112)',
    color: '#FFFFFF',
    padding: `0 ${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'center',
  },
  logoGrey: {
    height: 40,
    marginRight: theme.spacing(1),
  },
  separator: {
    margin: theme.spacing(1),
  },
  footerLaunch: {
    marginLeft: 2,
    fontSize: 10,
  },
  footerSeparator: {
    flexGrow: 1,
  },
  copyright: {
    fontSize: 10,
  },
});

export class WelcomeView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    terraUrl: PropTypes.string,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const loginOptions = {
      id: 'signin-button-container',
      scopes: ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/bigquery.readonly'],
      onsuccess: (user) =>
        dispatch(
          logIn(user.name, user.imageUrl, user.email, user.accessToken, user.accessTokenExpiration),
        ),
      onfailure: () => dispatch(logOut()),
    };
    renderLoginButton(loginOptions);
  }

  render() {
    const { classes, terraUrl } = this.props;

    return (
      <div className={classes.containerWrapper}>
        <div className={classes.container}>
          <div className={classes.mainContent}>
            <div className={classes.title}>Welcome to Terra Data Repository</div>
            <p className={classes.subtitle}>
              Terra Data Repository is a cloud-native platform that allows data owners to
              <b> govern</b> and <b>share</b> biomedical research data.
            </p>
            <p className={classes.subtitle}>
              <a
                className={classes.jadeLink}
                href="https://support.terra.bio/hc/en-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find how-to's, documentation, video tutorials, and discussion forums
                <LaunchOutlined fontSize="small" />
              </a>
            </p>
            <div id="signin-button-container" />
            <div className={classes.newUser}>New User?</div>
            <div className={classes.header}>Terra Data Repository requires a Google account.</div>
            <p>
              Terra Data Repository uses your Terra account which uses a Google account. Once you
              have signed in and completed the user profile registration step, you can start using
              Terra and Terra Data Repository.
            </p>
            <a href={terraUrl} className={classes.terraLink}>
              Need to create a Terra account?
            </a>
            <hr />
            <div>
              <div>
                <div className={classes.warning}>WARNING NOTICE</div>
                <div>
                  <p>
                    You are accessing a US Government web site which may contain information that
                    must be protected under the US Privacy Act or other sensitive information and is
                    intended Government authorized use only.
                  </p>
                  <p>
                    Unauthorized attempts to upload information, change information, or use of this
                    web site may result in disciplinary action, civil, and/or criminal penalties.
                    Unauthorized users of this website should have no expectation of privacy
                    regarding any communications or data processed by this website.
                  </p>
                  <p>
                    Anyone accessing this website expressly consents to monitoring of their actions
                    and all communications or data transiting or stored on related to this website
                    and is advised that if such monitoring reveals possible evidence of criminal
                    activity, NIH may provide that evidence to law enforcement officials.
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
        </div>
        <div className={classes.footer}>
          <a href={terraUrl} className={classes.logoGrey} target="_blank" rel="noopener noreferrer">
            <img alt="Terra" className={classes.logoGrey} src={LogoGrey} />
          </a>
          <a href={`${terraUrl}/#privacy`} target="_blank" rel="noopener noreferrer">
            Privacy Policy
            <LaunchOutlined className={classes.footerLaunch} />
          </a>
          <span className={classes.separator}>|</span>
          <a href={`${terraUrl}/#terms-of-service`} target="_blank" rel="noopener noreferrer">
            Terms of Service
            <LaunchOutlined className={classes.footerLaunch} />
          </a>
          <span className={classes.separator}>|</span>
          <a
            href="https://github.com/DataBiosphere/jade-data-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code
            <LaunchOutlined className={classes.footerLaunch} />
          </a>
          <div className={classes.footerSeparator} />
          <span className={classes.copyright}>Copyright ©2021</span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    terraUrl: state.configuration.configObject.terraUrl,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(WelcomeView));
