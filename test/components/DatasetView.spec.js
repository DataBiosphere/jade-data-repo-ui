import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import DatasetView from 'components/DatasetView';

const props = {
  classes: {},
};

function setup(ownProps = props) {
  return mount(
    <Provider store={store}>
      <DatasetView {...ownProps} />
    </Provider>,
  );
}

describe('DatasetView', () => {
  const wrapper = setup();

  it('hey look a datasets view', () => {
    wrapper.find('#datasets').simulate('click');
  });
});
