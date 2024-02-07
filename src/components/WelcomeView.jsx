import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { LaunchOutlined } from '@mui/icons-material';

import Hero from 'media/images/hero.png';
import LogoGrey from 'media/brand/logo-grey.svg?react';

import LoginButton from './auth/LoginButton';

const styles = (theme) => ({
  containerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    fontFamily: theme.typography.fontFamily,
    justifyContent: 'space-between',
    overflow: 'auto',
    background: `url(${Hero})`,
    backgroundPositionX: 'right',
    backgroundPositionY: 'top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '750px',
    flexGrow: 1,
  },
  title: {
    fontSize: '54px',
    lineHeight: '54px',
    paddingBottom: theme.spacing(2),
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '16px',
  },
  mainContent: {
    display: 'inline-block',
    color: theme.typography.color,
    marginTop: theme.spacing(5),
    padding: theme.spacing(10),
    paddingRight: '650px',
    paddingBottom: '40px',
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
    paddingTop: theme.spacing(2),
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
  },
  warning: {
    paddingBottom: theme.spacing(2),
  },
  warningTitle: {
    fontWeight: '900',
    paddingBottom: theme.spacing(2),
  },
  footer: {
    height: 60,
    width: '100%',
    background: 'rgb(109 110 112)',
    color: '#FFFFFF',
    padding: `${theme.spacing(2)}`,
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
});

export class WelcomeView extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    terraUrl: PropTypes.string,
  };

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
                href="https://support.terra.bio/hc/en-us"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={classes.jadeLink}>
                  Find how-to's, documentation, video tutorials, and discussion forums
                  <LaunchOutlined fontSize="small" />
                </span>
              </a>
            </p>
            <LoginButton />
            <div className={classes.header}>Terra Data Repository requires a Terra account.</div>
            <p>
              Terra Data Repository uses your Terra account. Once you have signed in and completed
              the user profile registration step, you can start using Terra and Terra Data
              Repository.
            </p>
            <a href={terraUrl}>
              <span className={classes.terraLink}>Need to create a Terra account?</span>
            </a>
            <hr />
            <div>
              <div className={classes.warning}>
                <div className={classes.warningTitle}>WARNING NOTICE</div>
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
            <LogoGrey alt="Terra" className={classes.logoGrey} />
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
          <span>Copyright ©2024</span>
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
