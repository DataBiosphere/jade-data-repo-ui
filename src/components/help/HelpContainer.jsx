import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HelpPanel from './HelpPanel';

const styles = (theme) => ({
  panelContainer: {
    fontFamily: theme.typography.fontFamily,
    left: '40%',
    height: '100%',
    position: 'fixed',
    'background-color': '#fafbfc',
    display: 'flex',
    'flex-direction': 'column',
    'flex-wrap': 'nowrap',
  },
  anotherContainer: {
    position: 'relative',
  },
  background: {
    background: 'grey',
    left: 0,
    right: 0,
    opacity: 0.6,
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
                X
              </div>
              <HelpPanel />
            </div>
          </div>
        </div>
      );
    }
    return <div onClick={this.handleHelpButtonClick}>help</div>;
  }
}

export default withStyles(styles)(HelpContainer);
