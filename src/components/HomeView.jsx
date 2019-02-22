import React from 'react';
import WelcomeView from './WelcomeView';

class HomeView extends React.PureComponent {
  render() {
    return (
      <div>
        Hello world home
        <WelcomeView />
      </div>
    );
  }
}

export default HomeView;
