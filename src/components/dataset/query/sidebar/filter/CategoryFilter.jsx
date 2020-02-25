import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export class CategoryFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    const { filterData, column, table } = this.props;
    const currTable = _.get(filterData, table);
    const currFilter = _.get(currTable, column.name);
    if (currFilter === undefined) {
      this.state = {
        checked: false,
        prevPropsFilterData: filterData,
      };
    } else {
      this.state = {
        checked: true,
        prevPropsFilterData: filterData,
      };
    }
  }

  static propTypes = {
    column: PropTypes.object,
    count: PropTypes.number,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    name: PropTypes.string,
    table: PropTypes.string,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.filterData !== state.prevPropsFilterData) {
      const currTable = _.get(props.filterData, props.table);
      const currFilter = _.get(_.get(currTable, props.column.name), 'value', {});
      const currValue = _.get(currFilter, props.name);
      if (currTable === undefined || currValue === undefined) {
        return {
          checked: false,
        };
      }
    }
    return null;
  }

  handleChange = event => {
    const { handleChange, name } = this.props;
    this.setState({
      checked: event.target.checked,
    });
    handleChange({
      name,
      value: event.target.checked,
    });
  };

  render() {
    const { checked } = this.state;
    const { name, count } = this.props;
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={this.handleChange}
            value={name}
            color="primary"
            size="small"
          />
        }
        label={`${name} (${count})`}
      />
    );
  }
}
