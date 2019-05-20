import React from 'react';

import DatasetView from 'components/DatasetView';

const props = {
  classes: {
    wrapper: 'wrapper',
  },
};

function setup(ownProps = props) {
  return shallow(<DatasetView {...ownProps} />, { attachTo: document.getElementById('react') });
}

describe('DatasetView', () => {
  const wrapper = setup();

  it('hey look a datasets view', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper.find('#datasets')).not.toBeNull();
  });
});
