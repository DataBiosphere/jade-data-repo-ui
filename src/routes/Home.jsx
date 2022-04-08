import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';

import WelcomeView from '../components/WelcomeView';

const styles = (theme) => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    minHeight: '100vh',
    maxHeight: '100vh',
    overflowY: 'auto',
  },
});

export class Home extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { classes, dispatch } = this.props;

    return (
      <div key="home" data-testid="home" className={classes.root}>
        <WelcomeView dispatch={dispatch} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(withStyles(styles)(Home));
