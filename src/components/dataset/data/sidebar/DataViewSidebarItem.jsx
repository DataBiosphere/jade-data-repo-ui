import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import RangeFilter from './filter/RangeFilter';
import CategoryWrapper from './filter/CategoryWrapper';

const styles = () => ({
  buttonContainer: {
    textAlign: 'end',
  },
});

export class DataViewSidebarItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
      disableButton: true,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    column: PropTypes.object,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    tableName: PropTypes.string,
  };

  // The 'apply' button should only be enabled when there are new changes to be applied.
  // Comparing against prevProps and prevState will find if a change has been made.
  componentDidUpdate(prevProps, prevState) {
    const { filterData, tableName, column } = this.props;
    const { filterMap } = this.state;
    // enable the button when there are unsaved changes
    if (!_.isEqual(prevState.filterMap, filterMap)) {
      this.setState({ disableButton: this.invalidChange(filterMap) });
    }
    // disable the button when filters have just been applied
    if (!_.isEqual(prevProps.filterData, filterData)) {
      const filters = _.get(filterData, [tableName, column.name], {});
      this.setState({ filterMap: filters, disableButton: true });
    }
  }

  handleChange = (value) => {
    const { column } = this.props;
    const { filterMap } = this.state;
    let type;
    switch (_.toLower(column.dataType)) {
      case 'string':
      case 'text':
      case 'dirref':
      case 'fileref':
        type = 'value';
        break;
      case 'float':
      case 'integer':
      case 'numeric':
      case 'int64':
      case 'float64':
        type = 'range';
        break;
      default:
        break;
    }
    const exclude = _.get(filterMap, 'exclude', false);
    this.setState({ filterMap: { value, type, exclude } });
  };

  applyFilters = () => {
    const { column, handleChange, tableName } = this.props;
    const { filterMap } = this.state;
    handleChange(column.name, filterMap, tableName);
  };

  // mark the filter as 'exclude' when the checkbox has been checked
  toggleExclude = (boxIsChecked) => {
    const { filterMap } = this.state;
    this.setState({ filterMap: { ...filterMap, exclude: boxIsChecked } });
  };

  invalidChange = (filterMap) => {
    const { value } = filterMap;
    if (filterMap.type === 'range') {
      const badNumber = (number) => number === '' || number.endsWith('.') || isNaN(number);
      return _.some(value, badNumber) || parseFloat(value[0]) > parseFloat(value[1]);
    }
    return _.isEmpty(value);
  };

  getFilteringComponent = () => {
    const { column, tableName } = this.props;
    const { dataType, arrayOf } = column;
    const { filterMap } = this.state;
    if (arrayOf) {
      return <div>Filtering on array fields is not yet supported in the UI</div>;
    }
    switch (_.toLower(dataType)) {
      case 'string':
      case 'text':
      case 'dirref':
      case 'fileref':
        return (
          <CategoryWrapper
            key={column.name}
            column={column}
            filterMap={filterMap}
            handleChange={this.handleChange}
            handleFilters={this.applyFilters}
            tableName={tableName}
            toggleExclude={this.toggleExclude}
          />
        );
      case 'float':
      case 'integer':
      case 'numeric':
      case 'int64':
      case 'float64':
        return (
          <RangeFilter
            key={column.name}
            column={column}
            filterMap={filterMap}
            handleChange={this.handleChange}
            handleFilters={this.applyFilters}
            tableName={tableName}
          />
        );
      default:
        return <div>Filtering on data type '{dataType}' is not yet supported in the UI</div>;
    }
  };

  render() {
    const { classes, column } = this.props;
    const { disableButton } = this.state;
    return (
      <div>
        {this.getFilteringComponent()}
        <div className={classes.buttonContainer}>
          <Button
            key={column.name}
            onClick={this.applyFilters}
            variant="contained"
            disableElevation
            disabled={disableButton}
            size="small"
            data-cy={`filter-${column.name}-button`}
          >
            Apply
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DataViewSidebarItem);
