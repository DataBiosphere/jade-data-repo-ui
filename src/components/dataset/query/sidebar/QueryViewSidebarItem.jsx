import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import { Slider } from '@material-ui/core';
import RangeFilter from './RangeFilter';

export class QueryViewSidebarItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: [0, 1000],
    };
  }

  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
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
    console.log(nameAndValue);
    handleChange(nameAndValue);
  };

  handleSliderValue = (event, newValue) => {
    this.setState({ value: newValue });
    this.handleChange({
      target: {
        value: newValue,
      },
    });
  };

  render() {
    const { column, dataset, tableName, token } = this.props;
    const { value } = this.state;

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
      case 'integer':
        return (
          // <Slider
          //   value={value}
          //   onChange={this.handleSliderValue}
          //   valueLabelDisplay="auto"
          //   aria-labelledby="range-slider"
          //   min={0}
          //   max={1000}
          // />
          <RangeFilter
            column={column}
            dataset={dataset}
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
