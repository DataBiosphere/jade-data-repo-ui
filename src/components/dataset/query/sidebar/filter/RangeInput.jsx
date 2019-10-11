import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export class RangeInput extends React.PureComponent {
  static propTypes = {
    handleChange: PropTypes.func,
    labelName: PropTypes.string,
    value: PropTypes.number,
  };

  render() {
    const { handleChange, labelName, value } = this.props;
    return (
      <TextField
        label={labelName}
        type="number"
        name="email"
        margin="normal"
        onChange={handleChange}
        readOnly={false}
        variant="outlined"
        value={value}
      />
    );
  }
}

export default RangeInput;
