import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import { WelcomeView } from 'components/WelcomeView';

const mockDispatch = jest.fn();
const ownProps = {
  dispatch: mockDispatch,
  classes: {},
  configuration: {
    clientId: '5',
  },
  users: {},
};

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
