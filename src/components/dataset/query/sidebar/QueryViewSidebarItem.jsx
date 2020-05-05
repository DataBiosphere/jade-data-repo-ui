import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import RangeFilter from './filter/RangeFilter';
import CategoryWrapper from './filter/CategoryWrapper';
import { Button } from '@material-ui/core';

export class QueryViewSidebarItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
      disableButton: true,
    };
  }

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

  componentDidUpdate(prevProps, prevState) {
    const { filterData, tableName, column } = this.props;
    const { filterMap } = this.state;
    if (!_.isEqual(prevState.filterMap, filterMap)) {
      this.setState({ disableButton: _.isEmpty(filterMap.value) });
    }
    if (!_.isEqual(prevProps.filterData, filterData)) {
      const filters = _.get(filterData, [tableName, column.name], {});
      this.setState({ filterMap: filters, disableButton: true });
    }
  }

  handleChange = (value) => {
    const { column } = this.props;
    const type = column.datatype === 'string' ? 'value' : 'range';
    this.setState({ filterMap: { value, type } });
  };

  applyFilters = () => {
    const { column, handleChange, tableName } = this.props;
    const { filterMap } = this.state;
    handleChange(column.name, filterMap, tableName);
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
    const { disableButton, filterMap } = this.state;
    const item =
      column.datatype === 'string' ? (
        <CategoryWrapper
          column={column}
          dataset={dataset}
          filterMap={filterMap}
          filterStatement={filterStatement}
          joinStatement={joinStatement}
          handleChange={this.handleChange}
          handleFilters={handleFilters}
          tableName={tableName}
          token={token}
        />
      ) : column.datatype === 'float' || column.datatype === 'integer' ? (
        <RangeFilter
          column={column}
          dataset={dataset}
          filterMap={filterMap}
          handleChange={this.handleChange}
          handleFilters={handleFilters}
          tableName={tableName}
          token={token}
        />
      ) : (
        <div />
      );
    return (
      <div>
        {item}
        <Button
          onClick={() => this.setState({ filterMap: {} })}
          disabled={disableButton}
          size="small"
          data-cy={`reset-${column.name}-button`}
        >
          Reset Filter
        </Button>
        <Button
          onClick={this.applyFilters}
          variant="contained"
          disableElevation
          disabled={disableButton}
          size="small"
          data-cy={`filter-${column.name}-button`}
        >
          Apply Filter
        </Button>
      </div>
    );
  }
}

export default QueryViewSidebarItem;
