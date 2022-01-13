import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as ExitSVG } from 'media/icons/times-light.svg';
import HelpPanel from './HelpPanel';

const styles = (theme) => ({
  panelContainer: {
    color: '#333F52',
    fontFamily: theme.typography.fontFamily,
    right: '0',
    'max-width': '815px',
    height: 'calc(100% - 64px)', // 64px = height of top nav bar
    position: 'fixed',
    'background-color': '#E9ECEF',
    display: 'flex',
    'flex-direction': 'column',
    'flex-wrap': 'nowrap',
  },
  anotherContainer: {
    position: 'relative',
    height: '100%',
  },
  background: {
    background: '#000000',
    left: 0,
    right: 0,
    opacity: 0.4,
    height: '100%',
    position: 'fixed',
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '1em',
    width: '3em',
    height: '3em',
    cursor: 'pointer',
  },
  footer: {
    position: 'absolute',
    bottom: '0',
    background: '#d7dbdf',
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

class HelpContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleHelpButtonClick = this.handleHelpButtonClick.bind(this);
    this.handleHelpExitClick = this.handleHelpExitClick.bind(this);
    this.state = { helpExpanded: false };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  handleHelpButtonClick() {
    this.setState({ helpExpanded: true });
  }

  handleHelpExitClick() {
    this.setState({ helpExpanded: false });
  }

  render() {
    const { classes } = this.props;
    const { helpExpanded } = this.state;
    if (helpExpanded) {
      return (
        <div>
          <div className={classes.background} onClick={this.handleHelpExitClick} />
          <div className={classes.panelContainer}>
            <div className={classes.anotherContainer}>
              <div className={classes.close} onClick={this.handleHelpExitClick}>
                <ExitSVG />
              </div>
              <HelpPanel />
              <div className={classes.footer}>
                <p>
                  <b>Not finding what you are looking for?</b>
                  <br />
                  Visit the <a className={classes.jadeLink} href="https://support.terra.bio/hc/en-us/sections/4407099323675-Terra-Data-Repository"  target="_blank" rel="noopener noreferrer">Terra Support Hub</a> or <a className={classes.jadeLink} href="https://support.terra.bio/hc/en-us/requests/new" target="_blank" rel="noopener noreferrer">contact us</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div onClick={this.handleHelpButtonClick}>help</div>;
  }
}

export default withStyles(styles)(HelpContainer);
