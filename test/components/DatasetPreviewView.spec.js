import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import DatasetPreviewView from 'components/DatasetPreviewView';

const props = {
  classes: {},
};

function setup(ownProps = props) {
  return mount(
    <Provider store={store}>
      <DatasetPreviewView {...ownProps} />
    </Provider>,
  );
}

describe('DatasetPreviewView', () => {
  const wrapper = setup();

  it('hey look a datasets preview', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.find('#dataset-preview')).not.toBeNull();
  });
});
