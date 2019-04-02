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
    wrapper.find('#datasetDetailView').simulate('click');
  });
});
