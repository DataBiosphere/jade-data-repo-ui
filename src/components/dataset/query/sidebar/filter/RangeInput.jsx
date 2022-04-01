import React from 'react';
import PropTypes from 'prop-types';

import { TextField, Input } from '@mui/material';

export class RangeInput extends React.PureComponent {
  static propTypes = {
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    value: PropTypes.string,
  };

  handleReturn = (event) => {
    const { handleFilters } = this.props;

    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  render() {
    const { handleChange, value } = this.props;
    return (
      <TextField
        onChange={handleChange}
        variant="outlined"
        margin="dense"
        value={value || ''}
        onKeyPress={this.handleReturn}
      >
        <Input readOnly={false} />
      </TextField>
    );
  }
}

export default RangeInput;
