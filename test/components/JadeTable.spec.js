import React from 'react';

import { JadeTable } from '../../src/components/table/JadeTable';

const ownProps = {
  columns: [
    { label: 'Study Name', property: 'name' },
    { label: 'Description', property: 'description' },
    { label: 'Last changed', property: 'createdDate' },
    { label: 'Date created', property: 'modifiedDate' },
  ],
  rows: [
    {
      id: 'foobar',
      name: 'Foo',
      description: 'This is a foo',
      createdDate: '2019-03-10T11:49:45Z',
      modifiedDate: '2019-03-11T12:30:15Z',
    },
  ],
  classes: {
    root: 'root',
    table: 'table',
  },
};

function setup() {
  return mount(<JadeTable {...ownProps} />);
}

describe('JadeTable', () => {
  const wrapper = setup();

  it('should render correctly', () => {
    expect(wrapper).not.toBeNull();
    expect(
      wrapper
        .find('TableCell')
        .first()
        .text(),
    ).toEqual('Study Name');
    expect(
      wrapper
        .find('TableRow')
        .at(1)
        .find('TableCell')
        .first()
        .text(),
    ).toEqual('Foo');
  });
});
