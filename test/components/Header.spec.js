import React from 'react';

import Header from 'components/Header';

const mockDispatch = jest.fn();

function setup(isAuthenticated) {
  const props = {
    app: {},
    dispatch: mockDispatch,
    location: {
      pathname: '/',
    },
    user: { isAuthenticated: isAuthenticated },
  };

  return mount(<Header suppressClassNameWarning {...props} />);
}

describe('Header', () => {
  let wrapper = setup(false);

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  wrapper = setup(true);

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle clicks', () => {
    wrapper.find('Logout').simulate('click');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'USER_LOGOUT',
      payload: {},
    });
  });
});
