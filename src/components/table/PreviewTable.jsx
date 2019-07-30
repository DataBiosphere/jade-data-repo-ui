import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import JadeTable from './JadeTable';

export default class PreviewTable extends React.PureComponent {
  static propTypes = {
    table: PropTypes.object.isRequired,
  };

  render() {
    const { table } = this.props;
    if (!table.preview) {
      return <div>No data.</div>;
    }
    const columns = table.columns.map((col, j) => ({
      label: col.name,
      property: col.name,
      render: row => {
        const value = row.f[j + 1].v;
        if (_.isArray(value)) {
          return _(value)
            .map('v')
            .value()
            .join(', ');
        }
        return value;
      },
    }));
    const keyFn = row => row.f[0].v;
    return (
      <JadeTable
        columns={columns}
        rowKey={keyFn}
        rows={table.preview}
        summary={true}
        itemType="rows"
      />
    );
  }
}
