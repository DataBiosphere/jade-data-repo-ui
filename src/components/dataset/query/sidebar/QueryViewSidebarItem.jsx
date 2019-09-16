import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import RangeFilter from './RangeFilter';

export class QueryViewSidebarItem extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    dataset: PropTypes.object,
    handleChange: PropTypes.func,
    tableName: PropTypes.string,
    token: PropTypes.string,
  };

  handleChange = event => {
    const { column, handleChange } = this.props;

    const nameAndValue = {
      name: column.name,
      value: event.target.value,
    };
    handleChange(nameAndValue);
  };

  handleSliderValue = (event, newValue) => {
    this.setState({ value: newValue });
    this.handleChange({
      target: {
        value: newValue,
      },
    });
  };

  render() {
    const { column, dataset, tableName, token } = this.props;

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
      case 'integer':
        return (
          <RangeFilter
            column={column}
            dataset={dataset}
            handleChange={this.handleChange}
            tableName={tableName}
            token={token}
          />
        );
      default:
        return <div />;
    }
  }
}

export default QueryViewSidebarItem;
