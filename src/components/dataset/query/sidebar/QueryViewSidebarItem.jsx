import React from 'react';
import PropTypes from 'prop-types';

import RangeFilter from './filter/RangeFilter';
import CategoryFilter, { CategoryWrapper } from './filter/CategoryWrapper';

export class QueryViewSidebarItem extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  handleChange = event => {
    const { column, handleChange } = this.props;

    const nameAndValue = {
      name: column.name,
      value: event.target.value,
    };
    handleChange(nameAndValue);
  };

  render() {
    const { column, dataset, filterData, tableName, token } = this.props;

    switch (column.datatype) {
      case 'string':
        return (
          <CategoryWrapper
            column={column}
            dataset={dataset}
            filterData={filterData}
            handleChange={this.handleChange}
            tableName={tableName}
            token={token}
          />
        );
      case 'float':
      case 'integer':
        return (
          <RangeFilter
            column={column}
            dataset={dataset}
            filterData={filterData}
            handleChange={this.handleChange}
            tableName={tableName}
            token={token}
          />
        );
      default:
        return <div />;
    }
  }
}

export default QueryViewSidebarItem;
