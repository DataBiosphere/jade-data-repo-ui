import React from 'react';

import DatasetCreateView from 'components/DatasetCreateView';

jest.mock('components/Transition', () => ({ children }) => (
  <div className="transition">{children}</div>
));

const mockDispatch = jest.fn();
const props = {
  app: {
    alerts: [],
  },
  dispatch: mockDispatch,
};

function setup(ownProps = props) {
  return <DatasetCreateView {...ownProps} />;
}

describe('DatasetCreateView', () => {
  const wrapper = setup();

  it('should render all zones', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render all zones', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
