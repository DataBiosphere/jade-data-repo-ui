import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ReactComponent as ExitSVG } from 'media/icons/times-light.svg';
import { ReactComponent as QuestionCircleSVG } from 'media/icons/question-circle-solid.svg';
import HelpFooter from './HelpFooter';
import HelpContent from './HelpContent';

const styles = (theme) => ({
  panelContainer: {
    color: theme.typography.color,
    fontFamily: theme.typography.fontFamily,
    right: '0',
    'max-width': '815px',
    height: 'calc(100% - ' + theme.constants.navBarHeight + ')',
    position: 'fixed',
    'background-color': theme.palette.panel.background,
    display: 'flex',
    'flex-direction': 'column',
    'flex-wrap': 'nowrap',
    'z-index': 1,
  },
  contentAndCloseArrowFormat: {
    position: 'relative',
    height: '100%',
  },
  background: {
    background: theme.palette.panel.outsidePanel,
    left: 0,
    right: 0,
    opacity: theme.palette.panel.outsidePanelOpacity,
    height: '100%',
    position: 'fixed',
    'z-index': 1,
  },
  exitButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '1em',
    width: '3em',
    height: '3em',
    cursor: 'pointer',
    ...theme.mixins.jadeLink,
  },
  helpOpenButton: {
    height: '48px',
    width: '48px',
    position: 'absolute',
    right: 0,
    cursor: 'pointer',
    ...theme.mixins.jadeLink,
  },
  helpOpen: {
    padding: '8px',
    width: '100%',
    height: '100%',
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
            <div className={classes.contentAndCloseArrowFormat}>
              <div className={classes.exitButton} onClick={this.handleHelpExitClick}>
                <ExitSVG />
              </div>
              <HelpContent />
              <HelpFooter />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div onClick={this.handleHelpButtonClick} className={classes.helpOpen}>
        <QuestionCircleSVG className={classes.helpOpenButton} />
      </div>
    );
  }
}

export default withStyles(styles)(HelpContainer);
