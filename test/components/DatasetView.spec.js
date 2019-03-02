import React from 'react';

import DatasetView from 'components/DatasetView';

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
  return <DatasetView {...ownProps} />;
}

describe('DatasetView', () => {
  const wrapper = setup();

  it('should render all zones', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
