import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { CategoryFilter } from './CategoryFilter';

export class CategoryFilterGroup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
    };
  }

  static propTypes = {
    column: PropTypes.object,
    filterMap: PropTypes.object,
    handleChange: PropTypes.func,
    originalValues: PropTypes.object,
    values: PropTypes.object,
    table: PropTypes.string,
  };

  componentDidUpdate(prevProps) {
    const { filterMap } = this.props;
    if (!_.isEqual(filterMap, prevProps.filterMap)) {
      const selected = _.get(filterMap, 'value', {});
      this.setState({ selected });
    }
  }

  handleChange = (box) => {
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
    const { column, values, table, originalValues, filterMap } = this.props;
    const checkboxes = _.keys(originalValues).map((name) => {
      const { hasOwnProperty } = values;
      const count = hasOwnProperty(name) ? parseInt(values[name], 10) : 0;
      return (
        <div key={name}>
          <CategoryFilter
            column={column}
            filterMap={filterMap}
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
