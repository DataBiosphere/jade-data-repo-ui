import React from 'react';

import { App } from 'containers/App';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';

const mockDispatch = jest.fn();

const props = {
  app: {
    alerts: [],
  },
  dispatch: mockDispatch,
  user: {
    isAuthenticated: false,
  },
  classes: {},
};

function setup(ownProps = props) {
  return shallow(<App {...ownProps} />, { attachTo: document.getElementById('react') });
}

describe('App', () => {
  const wrapper = setup();

  it('should render properly for anonymous users', () => {
    expect(wrapper.find(AppBar)).toExist();
    expect(wrapper.find(Button)).not.toExist();
  });

  it('should render properly for logged users', () => {
    wrapper.setProps({
      ...wrapper.props(),
      user: {
        isAuthenticated: true,
      },
    });

    // only logged in users should see the logout button
    expect(wrapper.find(Button)).toExist();
  });
});
