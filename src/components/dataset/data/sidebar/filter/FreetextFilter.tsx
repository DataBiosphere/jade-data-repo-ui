import React, { useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { WithStyles, withStyles } from '@mui/styles';
import { FormControlLabel, Checkbox, Typography, CustomTheme } from '@mui/material';
import { TdrState } from 'reducers';

import { TableColumnType } from 'src/reducers/query';

const styles = (theme: CustomTheme) => ({
  listItem: {
    margin: `${theme.spacing(0.5)} 0px`,
  },
  chip: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
});

interface FreetextFilterProps extends WithStyles<typeof styles> {
  classes: any;
  column: TableColumnType;
  filterMap: any;
  handleChange: (value: any) => void;
  handleFilters: () => void;
  toggleExclude: (boxIsChecked: boolean) => void;
  values: any;
}

const FreetextFilter = withStyles(styles)(
  ({
    classes,
    column,
    filterMap,
    handleChange,
    handleFilters,
    toggleExclude,
    values,
  }: FreetextFilterProps) => {
    const [inputValue, setInputValue] = useState('');

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setInputValue(value);
    };

    const onChange = (_event: any, value: any) => {
      setInputValue('');
      if (handleChange) {
        handleChange(value);
      }
    };

    const handleReturn = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && handleFilters) {
        handleFilters();
      }
    };

    const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const text = event.clipboardData.getData('text');
      const selections = text.split(/[ ,\r\n]+/);
      const nonEmpty = selections.filter((s: string) => s !== '');
      const updatedValueArray = _.get(filterMap, 'value', []).concat(nonEmpty);
      if (handleChange) {
        handleChange(updatedValueArray);
      }
    };

    const deleteChip = (option: any) => {
      const selected = _.filter(filterMap.value, (v) => v !== option);
      handleChange(selected);
    };

    const value = _.get(filterMap, 'value', []);
    const valueList = values?.map((val: any) => val.value) ?? [];

    return (
      <div>
        <Autocomplete
          multiple
          id={`autocomplete-${column.name}`}
          options={valueList}
          getOptionLabel={(option) => option ?? '(empty)'}
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
              label={option ?? '(empty)'}
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
  },
);

function mapStateToProps(state: TdrState) {
  return {
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(FreetextFilter);
