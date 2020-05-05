import React, { Fragment } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import BigQuery from 'modules/bigquery';

import { Slider, Grid } from '@material-ui/core';
import RangeInput from './RangeInput';

export class RangeFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      minVal: 0,
      maxVal: 1000,
      value: [0, 1000],
      step: 1,
    };

    const { column, dataset, tableName, token } = this.props;
    const bq = new BigQuery();

    bq.getColumnMinMax(column.name, dataset, tableName, token).then((response) => {
      const min = parseFloat(response[0].v, 10);
      const max = parseFloat(response[1].v, 10);

      let step = 1;
      if (max - min <= 1) {
        step = 0.01;
      }

      this.setState({
        minVal: min,
        maxVal: max,
        step,
      });
    });
  }

  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterMap: PropTypes.object,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  handleSliderValue = (event, newValue) => {
    const { handleChange } = this.props;
    handleChange(newValue);
  };

  handleMinLabelValue = (event) => {
    const { value } = this.state;
    const newValue = [parseInt(event.target.value, 10), value[1]];

    this.handleSliderValue(null, newValue);
  };

  handleMaxLabelValue = (event) => {
    const { value } = this.state;
    const newValue = [value[0], parseInt(event.target.value, 10)];

    this.handleSliderValue(null, newValue);
  };

  render() {
    const { maxVal, minVal, step } = this.state;
    const { handleFilters, filterMap } = this.props;
    const value = _.get(filterMap, 'value', [minVal, maxVal]);
    return (
      <div>
        <Grid container={true} spacing={2}>
          <Grid item xs={5}>
            <RangeInput
              labelName="min"
              value={value[0]}
              handleChange={this.handleMinLabelValue}
              handleFilters={handleFilters}
            />
          </Grid>
          <Grid item xs={2}>
            —
          </Grid>
          <Grid item xs={5}>
            <RangeInput
              labelName="max"
              value={value[1]}
              handleChange={this.handleMaxLabelValue}
              handleFilters={handleFilters}
            />
          </Grid>
        </Grid>
        <Grid container={true}>
          <Fragment>
            <Slider
              value={value}
              onChange={this.handleSliderValue}
              valueLabelDisplay="off"
              aria-labelledby="range-slider"
              min={minVal}
              max={maxVal}
              step={step}
            />
          </Fragment>
        </Grid>
      </div>
    );
  }
}

export default RangeFilter;
