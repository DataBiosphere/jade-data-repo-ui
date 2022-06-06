import React, { useState, SyntheticEvent, ClipboardEvent, ChangeEvent, KeyboardEvent } from 'react';
import _ from 'lodash';

import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { CustomTheme } from '@mui/material/styles';
import Autocomplete, {
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material/Autocomplete';
import { ClassNameMap, withStyles } from '@mui/styles';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import BigQuery from 'modules/bigquery';
import { ColumnModel, DatasetModel } from 'generated/tdr';

const styles = (theme: CustomTheme) => ({
  listItem: {
    margin: `${theme.spacing(0.5)} 0px`,
  },
  chip: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
});

type FilterMap = {
  exclude: boolean;
  value: Array<string>;
};

type SelectStatementValue = {
  v: string;
};

type SelectStatementResponse = {
  f: Array<SelectStatementValue>;
};

type FreetextFilterProps = {
  classes: ClassNameMap;
  column: ColumnModel;
  dataset: DatasetModel;
  filterMap: FilterMap;
  filterStatement: string;
  handleChange: (value: (string | string[])[]) => null;
  handleFilters: () => null;
  joinStatement: string;
  tableName: string;
  toggleExclude: (checked: boolean) => null;
  token: string;
};

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
}: FreetextFilterProps) {
  const [options, setOptions] = useState<any>([]);
  const [inputValue, setInputValue] = useState('');
  const bq = new BigQuery();

  const transformResponse = (response: Array<SelectStatementResponse>) => {
    const newOptions: Array<string> = [];
    if (response) {
      // eslint-disable-next-line
      response.map((r) => {
        const name = r.f[0].v;
        newOptions.push(name);
      });
    }
    setOptions(newOptions);
  };

  const onInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
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

  const onChange = (
    _event: SyntheticEvent<Element, Event>,
    value: (string | string[])[],
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<string[]> | undefined,
  ) => {
    setInputValue('');
    handleChange(value);
  };

  const handleReturn = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  const onPaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty: Array<string> = selections.filter((s: string) => s !== '');
    const exisitingArray: Array<string> = _.get(filterMap, 'value', []);
    const updatedValueArray: Array<string> = exisitingArray.concat(nonEmpty);
    handleChange(updatedValueArray);
  };

  const deleteChip = (option: string) => {
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

export default withStyles(styles)(FreetextFilter);
