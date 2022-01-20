import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  footerContainer: {
    position: 'absolute',
    bottom: '0',
    background: theme.palette.panel.footer,
    width: '100%',
    height: '100px',
    'padding-left': '30px',
    'padding-top': '15px',
    'padding-bottom': '15px',
  },
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

class HelpFoooter extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.footerContainer}>
        <p>
          <b>Not finding what you are looking for?</b>
          <br />
          Visit the&nbsp;
          <a
            className={classes.jadeLink}
            href="https://support.terra.bio/hc/en-us/sections/4407099323675-Terra-Data-Repository"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terra Support Hub
          </a>
          &nbsp;or&nbsp;
          <a
            className={classes.jadeLink}
            href="https://support.terra.bio/hc/en-us/requests/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            contact us
          </a>
          .
        </p>
      </div>
    );
  }
}

export default withStyles(styles)(HelpFoooter);
