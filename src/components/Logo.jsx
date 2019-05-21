import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import TerraIcon from '../../assets/media/brand/logo-wShadow.svg';

const styles = theme => ({
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    alignItems: 'flex-start',
    display: 'inline-flex',
    height: theme.spacing.unit * 8,
  },
  logoTitle: {
    color: '#fff',
    fontFamily: theme.typography.fontFamily,
    fontSize: '18px',
    fontWeight: '500',
    paddingLeft: theme.spacing.unit,
  },
});

class Logo extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.logoContainer}>
        <TerraIcon className={classes.logo} alt="logo" />
        <span className={classes.logoTitle}>Data Repository</span>
      </div>
    );
  }
}

export default withStyles(styles)(Logo);
