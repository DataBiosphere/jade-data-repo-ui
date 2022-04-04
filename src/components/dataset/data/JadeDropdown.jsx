import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { MenuItem, FormControl, Select } from '@mui/material';

export class JadeDropdown extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string,
    onSelectedItem: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.string,
  };

  // Returns a controlled dropdown component for selecting a single item from a list
  render() {
    const { options, onSelectedItem, value, name } = this.props;

    return (
      <form autoComplete="off">
        <FormControl variant="outlined" fullWidth>
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
}

export default JadeDropdown;
