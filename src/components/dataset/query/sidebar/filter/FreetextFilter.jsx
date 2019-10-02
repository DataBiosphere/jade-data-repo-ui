import React from 'react';
import BigQuery from 'modules/bigquery';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';

export class FreetextFilter extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    handleChange: PropTypes.func,
  };

  render() {
    const { column, handleChange } = this.props;
    return (
      <Input
        placeholder={column.name}
        onChange={handleChange}
        inputProps={{
          'aria-label': 'description',
        }}
      />
    );
  }
}

export default FreetextFilter;
