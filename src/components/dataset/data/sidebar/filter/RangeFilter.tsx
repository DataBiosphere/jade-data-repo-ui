import React, { useEffect, Dispatch } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { DatasetModel } from 'generated/tdr';
import { Slider, Grid, Typography } from '@mui/material';
import { TableColumnType } from 'reducers/query';
import { getColumnStats } from 'actions';
import { Action } from 'redux';
import LoadingSpinner from 'components/common/LoadingSpinner';
import RangeInput from './RangeInput';
import { ColumnStatsRetrievalType, ResourceType } from '../../../../../constants';

type RangeFilterType = {
  column: TableColumnType;
  dataset: DatasetModel;
  dispatch: Dispatch<Action>;
  filterMap: any;
  handleChange: (value: any) => void;
  handleFilters: () => void;
  tableName: string;
};

function RangeFilter({
  column,
  dataset,
  dispatch,
  filterMap,
  handleChange,
  handleFilters,
  tableName,
}: RangeFilterType) {
  const { maxValue, minValue } = column;
  let step = 1;
  if (maxValue && minValue && maxValue - minValue <= 1) {
    step = 0.01;
  }

  useEffect(() => {
    if (column.isExpanded && column.minValue === undefined) {
      dispatch(
        getColumnStats(
          ResourceType.DATASET,
          dataset.id,
          tableName,
          column.name,
          ColumnStatsRetrievalType.RETRIEVE_ALL_NUMERIC,
        ),
      );
    }
  }, [dispatch, dataset.id, tableName, column.name, column.isExpanded, column.minValue]);

  const handleSliderValue = (_event: any, newValue: any) => {
    handleChange(newValue.map(_.toString));
  };

  const handleMinLabelValue = (event: any) => {
    const upper = _.get(filterMap, ['value', 1], maxValue);
    const newValue = [event.target.value, upper];

    handleSliderValue(null, newValue);
  };

  const handleMaxLabelValue = (event: any) => {
    const lower = _.get(filterMap, ['value', 0], minValue);
    const newValue = [lower, event.target.value];

    handleSliderValue(null, newValue);
  };

  const value = _.get(filterMap, 'value', [minValue, maxValue]);
  const { isLoading } = column;
  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      {maxValue && minValue && (
        <>
          <Grid container={true} spacing={2}>
            <Grid item xs={5}>
              <RangeInput
                value={value[0]}
                handleChange={handleMinLabelValue}
                handleFilters={handleFilters}
              />
            </Grid>
            <Grid item xs={2}>
              <Typography>-</Typography>
            </Grid>
            <Grid item xs={5}>
              <RangeInput
                value={value[1]}
                handleChange={handleMaxLabelValue}
                handleFilters={handleFilters}
              />
            </Grid>
          </Grid>
          <Grid container={true}>
            <Slider
              value={value.map(parseFloat)}
              onChange={handleSliderValue}
              valueLabelDisplay="off"
              aria-labelledby="range-slider"
              min={minValue === maxValue ? minValue - step : minValue}
              max={minValue === maxValue ? maxValue + step : maxValue}
              step={step}
            />
          </Grid>
        </>
      )}
      {(!minValue || !maxValue) && (
        <div data-cy="empty-column-message">
          This numeric column does not have any values to filter.
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(RangeFilter);
