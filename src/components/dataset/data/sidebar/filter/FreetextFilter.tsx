import React, { useState } from 'react';
import _ from 'lodash';

import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { WithStyles, withStyles, ClassNameMap, createStyles } from '@mui/styles';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import BigQuery from 'modules/bigquery';
import { DatasetModel, ColumnModel } from 'generated/tdr';
import { ColumnTextValues } from './FilterTypes';

type FilterMapType = {
  value: any;
  exclude: any;
}

interface FreetextFilterType extends WithStyles<typeof styles> {
  classes: ClassNameMap;
  column: ColumnModel;
  dataset: DatasetModel;
  filterMap: FilterMapType;
  filterStatement: string;
  handleChange: (value: ColumnTextValues) => void;
  handleFilters: () => void;
  joinStatement: string;
  table: string;
  tableName: string;
  toggleExclude: (boxIsChecked: boolean) => void;
  token: string;
}
const styles = (theme: CustomTheme) =>
  createStyles({
    listItem: {
      margin: `${theme.spacing(0.5)} 0px`,
    },
    chip: {
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius,
    },
  });

function FreetextFilter({
  classes,
  column,
  dataset,
  filterMap,
  filterStatement,
  handleChange,
  handleFilters,
  joinStatement,
  tableName,
  toggleExclude,
  token,
}: FreetextFilterType) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const transformResponse = (response: any) => {
    const options: any = [];
    if (response) {
      // eslint-disable-next-line
      response.map((r: any) => {
        const name = r.f[0].v;
        options.push(name);
      });
    }
    return options;
  };

  const onInputChange = async (event: any) => {
    const { value } = event.target;
    setInputValue(value);
    const bq = new BigQuery();
    const response = await bq.getAutocompleteForColumnDebounced(
      value,
      column.name,
      dataset,
      tableName,
      token,
      filterStatement,
      joinStatement,
    );

    const transformedResponse = transformResponse(response);
    setOptions(transformedResponse);
  };

  const onChange = (_event: any, value: any) => {
    setInputValue('');
    handleChange(value);
  };

  const handleReturn = (event: any) => {
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  const onPaste = (event: any) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty = selections.filter((s: any) => s !== '');
    const updatedValueArray = _.get(filterMap, 'value', []).concat(nonEmpty);
    handleChange(updatedValueArray);
  };

  const deleteChip = (option: any) => {
    const selected: any = _.filter(filterMap.value, (v) => v !== option);
    handleChange(selected);
  };

  const value = _.get(filterMap, 'value', []);

  return (
    <div>
      <Autocomplete
        multiple
        id={`autocomplete-${column.name}`}
        options={options}
        // this means the user's choice does not have to match the provided options
        freeSolo={true}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            margin="dense"
            onChange={onInputChange}
          />
        )}
        // tags are rendered manually in list under autocomplete box
        renderTags={() => null}
        inputValue={inputValue}
        onKeyPress={handleReturn}
        onPaste={onPaste}
        onChange={onChange}
        value={value}
        forcePopupIcon
        disableClearable
      />
      {value.map((option: any, index: any) => (
        <div key={index} className={classes.listItem}>
          <Chip
            label={option}
            onDelete={() => deleteChip(option)}
            variant="outlined"
            className={classes.chip}
          />
        </div>
      ))}
      {!_.isEmpty(value) && (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={filterMap.exclude}
              onChange={(event) => toggleExclude(event.target.checked)}
            />
          }
          label={<Typography variant="body2">Exclude all</Typography>}
          data-cy={`exclude-${column.name}`}
        />
      )}
    </div>
  );
}

export default withStyles(styles)(FreetextFilter);
