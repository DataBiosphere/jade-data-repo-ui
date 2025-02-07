import React from 'react';
import _ from 'lodash';
import { MenuItem, FormControl, Select, SelectChangeEvent, Box } from '@mui/material';

type IProps<T> = {
  disabled: boolean;
  name: string;
  onSelectedItem: (e: SelectChangeEvent) => void;
  options: T[];
  value: T;
  sx?: React.CSSProperties;
  includeNoneOption?: boolean;
};

function JadeDropdown({
  disabled,
  name,
  onSelectedItem,
  options,
  value,
  sx,
  includeNoneOption,
}: IProps<string>) {
  return (
    <form autoComplete="off">
      <FormControl disabled={disabled} variant="outlined" fullWidth>
        <Select
          value={value}
          onChange={(event) => onSelectedItem(event)}
          inputProps={{
            name,
            id: `${_.kebabCase(name)}-select`,
          }}
          displayEmpty
          renderValue={(val) => (!val ? name : val)}
          data-cy={_.camelCase(name)}
          sx={sx}
        >
          {includeNoneOption && (
            <MenuItem key="None" value="">
              <Box sx={{ fontStyle: 'italic' }}>None</Box>
            </MenuItem>
          )}
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
