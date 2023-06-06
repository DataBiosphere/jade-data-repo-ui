import React from 'react';
import _ from 'lodash';
import { MenuItem, FormControl, Select, SelectChangeEvent } from '@mui/material';

type IProps<T> = {
  disabled: boolean;
  name: string;
  onSelectedItem: (e: SelectChangeEvent) => void;
  options: T[];
  value: T;
};

function JadeDropdown({ disabled, name, onSelectedItem, options, value }: IProps<string>) {
  return (
    <form autoComplete="off">
      <FormControl disabled={disabled} variant="outlined" fullWidth>
        <Select
          value={value}
          onChange={(event) => onSelectedItem(event)}
          inputProps={{
            name,
            id: `${name}-select`,
          }}
          displayEmpty
          renderValue={(val) => (!val ? name : val)}
          data-cy={_.camelCase(name)}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt} data-cy={`menuItem-${opt}`}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}

export default JadeDropdown;
