import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { DatasetModel, ColumnModel } from 'generated/tdr';

import BigQuery from 'modules/bigquery';

import { Slider, Grid, Typography } from '@mui/material';
import RangeInput from './RangeInput';

type RangeFilterType = {
  column: ColumnModel;
  dataset: DatasetModel;
  filterMap: any;
  handleChange: (value: any) => void;
  handleFilters: () => void;
  tableName: string;
  token: string;
};

function RangeFilter({
  column,
  dataset,
  filterMap,
  handleChange,
  handleFilters,
  tableName,
  token,
}: RangeFilterType) {
  const [minVal, setMinVal] = useState('0');
  const [maxVal, setMaxVal] = useState('1000');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const bq = new BigQuery();

    bq.getColumnMinMax(column.name, dataset, tableName, token).then((response) => {
      const min = response[0].v;
      const max = response[1].v;

      let _step = 1;
      if (max - min <= 1) {
        _step = 0.01;
      }

      setMinVal(min);
      setMaxVal(max);
      setStep(_step);
    });
    // TODO - will fix by moving this to redux
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSliderValue = (_event: any, newValue: any) => {
    handleChange(newValue.map(_.toString));
  };

  const handleMinLabelValue = (event: any) => {
    const upper = _.get(filterMap, ['value', 1], maxVal);
    const newValue = [event.target.value, upper];

    handleSliderValue(null, newValue);
  };

  const handleMaxLabelValue = (event: any) => {
    const lower = _.get(filterMap, ['value', 0], minVal);
    const newValue = [lower, event.target.value];

    handleSliderValue(null, newValue);
  };

  const value = _.get(filterMap, 'value', [minVal, maxVal]);
  return (
    <div>
      {maxVal !== null && minVal !== null && (
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
              min={parseFloat(minVal)}
              max={parseFloat(maxVal)}
              step={step}
            />
          </Grid>
        </>
      )}
    </div>
  );
}

export default RangeFilter;
