import React from 'react';

import SnapshotView from 'components/SnapshotView';

const props = {
  classes: {
    wrapper: 'wrapper',
  },
};

function setup(ownProps = props) {
  return shallow(<SnapshotView {...ownProps} />, { attachTo: document.getElementById('react') });
}

describe('SnapshotView', () => {
  const wrapper = setup();

  it('hey look a snapshots view', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.find('#snapshots')).not.toBeNull();
  });
});
