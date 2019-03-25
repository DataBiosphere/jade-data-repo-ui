import React from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import Icon from 'assets/media/images/white-jade.png';

const styles = {
  logoStyles: {
    alignItems: 'flex-start',
    display: 'inline-flex',
    height: '41px',
    width: '41px',
  },
  titleStyles: {
    bottom: '12px',
    color: '#fff',
    fontSize: '21px',
    fontWeight: '500',
    left: '4px',
    position: 'relative',
  },
};

class Logo extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <img src={Icon} className={classes.logoStyles} alt="logo" />
        <span className={classes.titleStyles}>Jade Data Repository</span>
      </div>
    );
  }
}

export default withStyles(styles)(Logo);
