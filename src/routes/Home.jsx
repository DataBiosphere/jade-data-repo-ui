import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import WelcomeView from '../components/WelcomeView';

const homeStyles = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

export class Home extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { dispatch } = this.props;

    return (
      <div key="home" data-testid="home" style={homeStyles}>
        <WelcomeView dispatch={dispatch} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Home);
