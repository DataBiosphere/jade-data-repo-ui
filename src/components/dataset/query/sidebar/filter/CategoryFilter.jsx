import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export class CategoryFilter extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    count: PropTypes.number,
    filterData: PropTypes.object,
    filterMap: PropTypes.object,
    handleChange: PropTypes.func,
    name: PropTypes.string,
    table: PropTypes.string,
  };

  handleChange = (event) => {
    const { handleChange, name } = this.props;
    handleChange({
      name,
      value: event.target.checked,
    });
  };

  render() {
    const { filterMap, name, count } = this.props;
    const checked = _.get(filterMap, ['value', name], false);
    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={this.handleChange}
            value={name}
            color="primary"
            size="small"
            data-cy={`categoryFilterCheckbox-${name}`}
          />
        }
        label={`${name} (${count})`}
      />
    );
  }
}
