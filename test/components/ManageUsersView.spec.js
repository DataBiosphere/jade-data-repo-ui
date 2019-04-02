import React from 'react';

import ManageUsersView from '../../src/components/ManageUsersView';

const mockAddReader = jest.fn();
const mockRemoveReader = jest.fn();

const ownProps = {
  addReader: mockAddReader,
  defaultValue: '',
  removeReader: mockRemoveReader,
  readers: [],
};

function setup() {
  return mount(<ManageUsersView {...ownProps} />);
}

describe('ManageUsersView', () => {
  const wrapper = setup();

  it('should render correctly', () => {
    expect(wrapper).not.toBeNull();
  });
});
