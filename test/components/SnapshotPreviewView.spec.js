import React from 'react';
import { Provider } from 'react-redux';

import { store } from 'store/index';
import SnapshotPreviewView from 'components/SnapshotPreviewView';

const props = {
  classes: {},
  createdSnapshot: {
    snapshot: {
      id: 'snapshotId',
    },
    snapshotRequest: {
      readers: [],
    },
  },
  match: {
    params: {
      jobId: 'jobId',
    },
  },
};

function setup(ownProps = props) {
  return mount(
    <Provider store={store}>
      <SnapshotPreviewView {...ownProps} />
    </Provider>,
  );
}

describe('SnapshotPreviewView', () => {
  const wrapper = setup();

  it('hey look a snapshots preview', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.find('#snapshot-preview')).not.toBeNull();
  });
});
