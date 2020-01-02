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
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  componentWillReceiveProps(nextProps) {
    const { column } = nextProps;
    const { filterData } = this.props;
    const { minVal, maxVal } = this.state;
    const currFilter = _.get(nextProps.filterData, column.name);

    if (nextProps.filterData !== filterData && currFilter !== undefined) {
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

  handleSliderValue = (event, newValue) => {
    const { handleChange } = this.props;
    this.setState({ value: newValue });
    handleChange(newValue);
  };

  handleMinLabelValue = event => {
    const { value } = this.state;
    const newValue = [event.target.value, value[1]];

    this.handleSliderValue(null, newValue);
  };

  handleMaxLabelValue = event => {
    const { value } = this.state;
    const newValue = [value[0], event.target.value];

    this.handleSliderValue(null, newValue);
  };

  render() {
    const { maxVal, minVal, value } = this.state;
    const { handleFilters } = this.props;

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
            />
          </Fragment>
        </Grid>
      </div>
    );
  }
}

export default RangeFilter;
