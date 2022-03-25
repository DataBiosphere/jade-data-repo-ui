import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import RangeFilter from './filter/RangeFilter';
import CategoryWrapper from './filter/CategoryWrapper';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
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
    dataset: PropTypes.object,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
    handleChange: PropTypes.func,
    joinStatement: PropTypes.string,
    tableName: PropTypes.string,
    token: PropTypes.string,
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
    const type = ['string', 'text'].includes(column.dataType) ? 'value' : 'range';
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

  render() {
    const {
      classes,
      column,
      dataset,
      filterStatement,
      joinStatement,
      tableName,
      token,
    } = this.props;
    const { disableButton, filterMap } = this.state;
    const item = ((datatype) => {
      switch (_.toLower(datatype)) {
        case 'string':
        case 'text':
          return (
            <CategoryWrapper
              column={column}
              dataset={dataset}
              filterMap={filterMap}
              filterStatement={filterStatement}
              joinStatement={joinStatement}
              handleChange={this.handleChange}
              handleFilters={this.applyFilters}
              tableName={tableName}
              token={token}
              toggleExclude={this.toggleExclude}
            />
          );
        case 'float':
        case 'integer':
          return (
            <RangeFilter
              column={column}
              dataset={dataset}
              filterMap={filterMap}
              handleChange={this.handleChange}
              handleFilters={this.applyFilters}
              tableName={tableName}
              token={token}
            />
          );
        default:
          return <div />;
      }
    })(column.dataType);
    return (
      <div>
        {item}
        <div className={classes.buttonContainer}>
          <Button
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
