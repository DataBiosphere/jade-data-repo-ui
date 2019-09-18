import React from 'react';
import PropTypes from 'prop-types';

import BigQuery from 'modules/bigquery';

import { Slider } from '@material-ui/core';
import ValueLabel from './ValueLabel';

export class RangeFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      minVal: 0,
      maxVal: 1000,
      value: [0, 1000],
    };
    const { column, dataset, tableName, token } = this.props;
    const bq = new BigQuery();
    bq.getColumnMinMax(column.name, dataset, tableName, token).then(response => {
      const min = parseFloat(response[0].v, 10);
      const max = parseFloat(response[1].v, 10);

      this.setState({
        minVal: min,
        maxVal: max,
        value: [min, max],
      });
    });
  }

  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    handleChange: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  handleSliderValue = (event, newValue) => {
    const { handleChange } = this.props;
    this.setState({ value: newValue });
    handleChange({
      target: {
        value: newValue,
      },
    });
  };

  render() {
    const { maxVal, minVal, value } = this.state;
    const stepVal = (maxVal - minVal) / 20;
    return (
      <Slider
        value={value}
        ValueLabelComponent={ValueLabel}
        onChange={this.handleSliderValue}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        step={stepVal}
        marks
        min={minVal}
        max={maxVal}
      />
    );
  }
}

export default RangeFilter;
