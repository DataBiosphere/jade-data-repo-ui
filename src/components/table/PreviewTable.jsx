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
      render: row => row.f[j + 1].v,
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
