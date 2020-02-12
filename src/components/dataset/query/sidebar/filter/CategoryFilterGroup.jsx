import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { CategoryFilter } from './CategoryFilter';

export class CategoryFilterGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    const { filterData } = this.props;
    this.state = {
      selected: {},
      prevPropsFilterData: filterData,
    };
  }

  static propTypes = {
    column: PropTypes.object,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    originalValues: PropTypes.object,
    values: PropTypes.object,
    table: PropTypes.string,
  };

  static getDerivedStateFromProps(props, state) {
    if (!_.isEqual(props.filterData, state.prevPropsFilterData)) {
      return {
        selected: _.get(props.filterData, `${props.table}.${props.column.name}.value`, {}),
        prevPropsFilterData: props.filterData,
      };
    }
    return null;
  }

  handleChange = box => {
    const { handleChange } = this.props;
    const { selected } = this.state;
    const selectedClone = _.clone(selected);
    if (box.value) {
      selectedClone[box.name] = box.value;
      this.setState({
        selected: selectedClone,
      });
    } else {
      delete selectedClone[box.name];
      this.setState({ selected: selectedClone });
    }
    handleChange(selectedClone);
  };

  render() {
    const { column, filterData, values, table, originalValues } = this.props;
    const checkboxes = _.keys(originalValues).map(name => {
      const count = values.hasOwnProperty(name) ? values[name] : 0;
      return (
        <div key={name}>
          <CategoryFilter
            column={column}
            filterData={filterData}
            handleChange={this.handleChange}
            name={name}
            count={count}
            table={table}
          />
        </div>
      );
    });

    return <div>{checkboxes}</div>;
  }
}

export default CategoryFilterGroup;
