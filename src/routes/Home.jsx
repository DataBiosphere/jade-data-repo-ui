import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { Container } from 'styled-minimal';
import Background from 'components/Background';
import WelcomeView from '../components/WelcomeView';

const HomeContainer = styled(Container)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

export class Home extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { dispatch } = this.props;

    return (
      <Background key="home" data-testid="home">
        <HomeContainer>
          <WelcomeView dispatch={dispatch} />
        </HomeContainer>
      </Background>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Home);
