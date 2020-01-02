import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';

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
      <Input
        onChange={handleChange}
        readOnly={false}
        value={value}
        onKeyPress={this.handleReturn}
      />
    );
  }
}

export default RangeInput;
