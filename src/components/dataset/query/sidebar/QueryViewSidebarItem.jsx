import React from 'react';
import PropTypes from 'prop-types';

import RangeFilter from './filter/RangeFilter';
import CategoryWrapper from './filter/CategoryWrapper';

export class QueryViewSidebarItem extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
    joinStatement: PropTypes.string,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  handleChange = value => {
    const { column, handleChange, tableName } = this.props;
    const type = column.datatype === 'string' ? 'value' : 'range';
    const nameValueType = {
      name: column.name,
      value,
      type,
    };
    handleChange(nameValueType, tableName);
  };

  render() {
    const {
      column,
      dataset,
      filterData,
      filterStatement,
      joinStatement,
      handleFilters,
      tableName,
      token,
    } = this.props;
    switch (column.datatype) {
      case 'string':
        return (
          <CategoryWrapper
            column={column}
            dataset={dataset}
            filterData={filterData}
            filterStatement={filterStatement}
            joinStatement={joinStatement}
            handleChange={this.handleChange}
            handleFilters={handleFilters}
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
            handleFilters={handleFilters}
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
