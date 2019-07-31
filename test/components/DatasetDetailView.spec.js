import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import DatasetDetailView from 'components/DatasetDetailView';

const props = {
  classes: {},
  match: {
    params: {
      uuid: 'someuuid',
    },
  },
  dataset: {
    name: 'TODO: test this',
    description: 'describes a dataset',
  },
};

function setup(ownProps = props) {
  return mount(
    <Provider store={store}>
      <DatasetDetailView {...ownProps} />
    </Provider>,
  );
}

describe('DatasetDetailView', () => {
  const wrapper = setup();

  it('hey look a datasets detail view', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.find('#dataset-detail-view')).not.toBeNull();
  });
});
