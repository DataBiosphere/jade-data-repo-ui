import React from 'react';
import PropTypes from 'prop-types';

import { TextField, Input } from '@material-ui/core';

export class RangeInput extends React.PureComponent {
  static propTypes = {
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    labelName: PropTypes.string,
    value: PropTypes.number,
  };

  handleReturn = event => {
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
        value={value}
        onKeyPress={this.handleReturn}
      >
        <Input readOnly={false} />
      </TextField>
    );
  }
}

export default RangeInput;
