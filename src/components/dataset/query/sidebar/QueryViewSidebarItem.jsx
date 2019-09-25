import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import RangeFilter from './filter/RangeFilter';

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
          <Input
            placeholder={column.name}
            onChange={this.handleChange}
            inputProps={{
              'aria-label': 'description',
            }}
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
