import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { withStyles } from '@mui/styles';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import BigQuery from 'modules/bigquery';

const styles = (theme) => ({
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
  table,
  tableName,
  toggleExclude,
  token,
}) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const bq = new BigQuery();

  const transformResponse = (response) => {
    const newOptions = [];
    if (response) {
      // eslint-disable-next-line
      response.map((r) => {
        const name = r.f[0].v;
        newOptions.push(name);
      });
    }
    setOptions(newOptions);
  };

  const onInputChange = async (event) => {
    const { value } = event.target;

    setInputValue(value);

    const response = await bq.getAutocompleteForColumnDebounced(
      value,
      column.name,
      dataset,
      tableName,
      token,
      filterStatement,
      joinStatement,
    );

    transformResponse(response);
  };

  const onChange = (event, value) => {
    setInputValue('');
    handleChange(value);
  };

  const handleReturn = (event) => {
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  const onPaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty = selections.filter((s) => s !== '');
    const updatedValueArray = _.get(filterMap, 'value', []).concat(nonEmpty);
    handleChange(updatedValueArray);
  };

  const deleteChip = (option) => {
    const selected = _.filter(filterMap.value, (v) => v !== option);
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
      {value.map((option, index) => (
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

FreetextFilter.propTypes = {
  classes: PropTypes.object,
  column: PropTypes.object,
  dataset: PropTypes.object,
  filterMap: PropTypes.object,
  filterStatement: PropTypes.string,
  handleChange: PropTypes.func,
  handleFilters: PropTypes.func,
  joinStatement: PropTypes.string,
  table: PropTypes.string,
  tableName: PropTypes.string,
  toggleExclude: PropTypes.func,
  token: PropTypes.string,
};

export default withStyles(styles)(FreetextFilter);
