import React from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { push } from 'modules/hist';

import TerraIcon from 'media/brand/logo-wShadow.svg?react';

const styles = (theme) => ({
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  logo: {
    alignItems: 'flex-start',
    display: 'inline-flex',
    height: theme.spacing(8),
  },
  logoTitle: {
    color: '#fff',
    fontFamily: theme.typography.fontFamily,
    fontSize: '18px',
    fontWeight: '500',
    paddingLeft: theme.spacing(1),
  },
});

class Logo extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  handleGoHome = () => {
    push('/');
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.logoContainer} onClick={this.handleGoHome}>
        <TerraIcon className={classes.logo} alt="logo" />
        <span className={classes.logoTitle}>Data Repository</span>
      </div>
    );
  }
}

export default withStyles(styles)(Logo);
