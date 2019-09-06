import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import { Slider } from '@material-ui/core';

export class QueryViewSidebarItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: [0, 1000],
    };
  }

  static propTypes = {
    column: PropTypes.object,
    handleChange: PropTypes.func,
  };

  handleChange = event => {
    const { column, handleChange } = this.props;

    const idAndValue = {
      name: column.name,
      value: event.target.value,
    };
    handleChange(idAndValue);
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
    const { column } = this.props;
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
          <Slider
            value={value}
            onChange={this.handleSliderValue}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={1000}
          />
        );
      default:
        return <div />;
    }
  }
}

export default QueryViewSidebarItem;
