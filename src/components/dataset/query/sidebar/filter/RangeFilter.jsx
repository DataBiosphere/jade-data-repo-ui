import React from 'react';
import _ from 'lodash';
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
    const { column, dataset, filterData, tableName, token } = this.props;
    console.log(filterData);

    let currLeftValue = undefined;
    let currRightValue = undefined;

    const currFilter = _.get(filterData, column.name);
    if (currFilter !== undefined) {
      currLeftValue = currFilter[0];
      currRightValue = currFilter[1];
    }

    const bq = new BigQuery();
    bq.getColumnMinMax(column.name, dataset, tableName, token).then(response => {
      const min = parseFloat(response[0].v, 10);
      const max = parseFloat(response[1].v, 10);

      if (currLeftValue === undefined || currRightValue === undefined) {
        currLeftValue = min;
        currRightValue = max;
      }

      this.setState({
        minVal: min,
        maxVal: max,
        value: [currLeftValue, currRightValue],
      });
    });
  }

  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterData: PropTypes.object,
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

  componentWillReceiveProps(nextProps) {
    const { column, filterData } = nextProps;
    const { minVal, maxVal } = this.state;
    const currFilter = _.get(filterData, column.name);

    if (nextProps.filterData !== this.props.filterData && currFilter !== undefined) {
      const currLeftValue = currFilter[0];
      const currRightValue = currFilter[1];
      this.setState({
        value: [currLeftValue, currRightValue],
      });
    } else {
      this.setState({
        value: [minVal, maxVal],
      });
    }
  }

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
