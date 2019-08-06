import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import SnapshotDetailView from 'components/SnapshotDetailView';

const props = {
  classes: {},
  match: {
    params: {
      uuid: 'someuuid',
    },
  },
  snapshot: {
    name: 'TODO: test this',
    description: 'describes a snapshot',
  },
};

function setup(ownProps = props) {
  return mount(
    <Provider store={store}>
      <SnapshotDetailView {...ownProps} />
    </Provider>,
  );
}

describe('SnapshotDetailView', () => {
  const wrapper = setup();

  it('hey look a snapshots detail view', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.find('#snapshot-detail-view')).not.toBeNull();
  });
});
