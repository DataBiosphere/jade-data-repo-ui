import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

// import { store } from 'store/index';
import WelcomeView from '../../src/components/WelcomeView';

// const mockDispatch = jest.fn();
const ownProps = {
  dispatch: mockDispatch,
  configuration: {
    clientId: '5',
  },
  users: {},
};

const defaultState = {
  configuration: {
    configuration: {
      clientId: '970791974390-1581mjhtp2b3jmg4avhor1vabs13b7ur.apps.googleusercontent.com',
    },
  },
};

function todos(state = [], action) {
  switch (action.type) {
    case 'USER_LOGIN':
      return defaultState;
    default:
      return defaultState;
  }
}

const store = createStore(todos, [defaultState]);
const mockDispatch = jest.fn();

store.dispatch({
  type: 'USER_LOGIN',
  payload: {},
  mockDispatch,
});

jest.mock('react-google-login/dist/google-login', () => ({
  GoogleLogin: props => {
    const { onSuccess } = props;
    return <button type="button" onClick={onSuccess} />;
  },
}));

function setup() {
  return mount(
    <Provider store={store}>
      <WelcomeView {...ownProps} />
    </Provider>,
  );
}

describe('WelcomeView', () => {
  const wrapper = setup();

  it('should handle login success', () => {
    const mockGoogleLogin = wrapper
      .find('GoogleLogin')
      .find('button')
      .simulate('click');

    expect(mockGoogleLogin).not.toBeNull();
    expect(mockGoogleLogin.length).toEqual(1);
    // expect(mockDispatch).toHaveBeenCalledWith({ payload: {}, type: 'USER_LOGIN' });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
