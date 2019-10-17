import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';

export class RangeInput extends React.PureComponent {
  static propTypes = {
    handleChange: PropTypes.func,
    labelName: PropTypes.string,
    value: PropTypes.number,
  };

  render() {
    const { handleChange, value } = this.props;
    return <Input onChange={handleChange} readOnly={false} value={value} />;
  }
}

export default RangeInput;
