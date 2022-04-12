import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import LightTable from './LightTable';

export default class PreviewTable extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    table: PropTypes.object.isRequired,
    tablePreview: PropTypes.object,
  };

  render() {
    const { loading, table, tablePreview } = this.props;
    if (!tablePreview) {
      return <div>No data.</div>;
    }
    const columns = table.columns.map((col, j) => ({
      label: col.name,
      name: col.name,
      allowSort: true,
      render: (row) => {
        // the first column is the row id, we won't display it but we do use it for the rowKey below
        const value = row.f[j + 1].v;
        // the value might be an array of objects with values at key `v`. for now join them with a comma
        if (_.isArray(value)) {
          return value.map((x) => x.v).join(', ');
        }
        return value;
      },
    }));
    const keyFn = (row) => row.f[0].v;
    return (
      <LightTable
        columns={columns}
        rowKey={keyFn}
        rows={tablePreview}
        summary={true}
        itemType="rows"
        loading={loading}
      />
    );
  }
}
