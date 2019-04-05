import React from 'react';

import Logo from '../../src/components/Logo';

const ownProps = {
  classes: '',
};

function setup() {
  return mount(<Logo {...ownProps} />);
}

describe('Logo', () => {
  const wrapper = setup();

  it('should render correctly', () => {
    expect(wrapper).not.toBeNull();
  });
});
