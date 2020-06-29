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
      minVal: '0',
      maxVal: '1000',
      step: 1,
    };

    const { column, dataset, tableName, token } = this.props;
    const bq = new BigQuery();

    bq.getColumnMinMax(column.name, dataset, tableName, token).then((response) => {
      const min = response[0].v;
      const max = response[1].v;

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
    handleChange(newValue.map(_.toString));
  };

  handleMinLabelValue = (event) => {
    const { filterMap } = this.props;
    const { maxVal } = this.state;
    const upper = _.get(filterMap, ['value', 1], maxVal);
    const newValue = [event.target.value, upper];

    this.handleSliderValue(null, newValue);
  };

  handleMaxLabelValue = (event) => {
    const { filterMap } = this.props;
    const { minVal } = this.state;
    const lower = _.get(filterMap, ['value', 0], minVal);
    const newValue = [lower, event.target.value];

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
              value={value.map(parseFloat)}
              onChange={this.handleSliderValue}
              valueLabelDisplay="off"
              aria-labelledby="range-slider"
              min={parseFloat(minVal)}
              max={parseFloat(maxVal)}
              step={step}
            />
          </Fragment>
        </Grid>
      </div>
    );
  }
}

export default RangeFilter;
