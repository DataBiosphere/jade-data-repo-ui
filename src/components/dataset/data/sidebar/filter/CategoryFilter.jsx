import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export class CategoryFilter extends React.PureComponent {
  static propTypes = {
    filteredCount: PropTypes.number,
    filterMap: PropTypes.object,
    handleChange: PropTypes.func,
    name: PropTypes.string,
    totalCount: PropTypes.number,
  };

  handleChange = (event) => {
    const { handleChange, name } = this.props;
    handleChange({
      name,
      value: event.target.checked,
    });
  };

  render() {
    const { filterMap, name, filteredCount, totalCount } = this.props;
    const formattedCount =
      filteredCount === totalCount ? totalCount : `${filteredCount} filtered, ${totalCount} total`;
    const checked = _.get(filterMap, ['value', name], false);
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={this.handleChange}
            value={name ?? 'null'}
            color="primary"
            size="small"
            data-cy={`categoryFilterCheckbox-${name}`}
          />
        }
        label={`${name} (${formattedCount})`}
      />
    );
  }
}
