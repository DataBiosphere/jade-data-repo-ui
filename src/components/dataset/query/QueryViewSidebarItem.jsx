import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';

export class QueryViewSidebarItem extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    handleChange: PropTypes.func,
  };

  handleChange = event => {
    const { column, handleChange } = this.props;

    const idAndValue = {
      name: column.name,
      value: event.target.value,
    };
    handleChange(idAndValue);
  };

  render() {
    const { column } = this.props;

    switch (column.datatype) {
      case 'string':
        return (
          <Input
            placeholder={column.name}
            onChange={this.handleChange}
            inputProps={{
              'aria-label': 'description',
            }}
          />
        );
      default:
        return <div />;
    }
  }
}

export default QueryViewSidebarItem;
