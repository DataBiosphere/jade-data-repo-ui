import React from 'react';

import Header from 'containers/Header';

const mockDispatch = jest.fn();

function setup() {
  const props = {
    dispatch: mockDispatch,
  };

  return mount(<Header {...props} />);
}

describe('Header', () => {
  const wrapper = setup();

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
