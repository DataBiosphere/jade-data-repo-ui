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
    user: { isAuthenticated },
  };

  return mount(<Header suppressClassNameWarning {...props} />);
}

describe('Header', () => {
  let wrapper = setup(false);
  wrapper = setup(true);

  it('should handle clicks', () => {
    wrapper.find('Logout').simulate('click');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'USER_LOGOUT',
      payload: {},
    });
  });
});
