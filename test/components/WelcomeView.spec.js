import React from 'react';

import WelcomeView from '../../src/components/WelcomeView';

const mockDispatch = jest.fn();
const ownProps = {
  dispatch: mockDispatch,
  users: {},
};

jest.mock('react-google-login/dist/google-login', () => ({
  GoogleLogin: props => {
    const { onSuccess } = props;
    return <button type="button" onClick={onSuccess} />;
  },
}));

function setup() {
  return mount(<WelcomeView {...ownProps} />);
}

describe('WelcomeView', () => {
  const wrapper = setup();

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle login success', () => {
    const mockGoogleLogin = wrapper
      .find('GoogleLogin')
      .find('button')
      .simulate('click');

    expect(mockGoogleLogin).not.toBeNull();
    expect(mockGoogleLogin.length).toEqual(1);
    expect(mockDispatch).toHaveBeenCalledWith({ payload: {}, type: 'USER_LOGIN' });
  });
});
