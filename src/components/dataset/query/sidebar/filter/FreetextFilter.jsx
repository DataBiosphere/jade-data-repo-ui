import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';

export class FreetextFilter extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    originalValues: PropTypes.object,
    table: PropTypes.string,
    values: PropTypes.object,
  };

  onComplete = (event, value) => {
    const { handleChange } = this.props;
    handleChange(value);
  };

  handleReturn = (event) => {
    const { handleFilters } = this.props;
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  onChange = (event) => {
    const { handleChange } = this.props;
    const { value } = event.target;
    let selections;
    if (value.includes(',')) {
      selections = value.split(',');
    } else if (value.includes(' ')) {
      selections = value.split(' ');
    } else {
      return;
    }
    const trimmed = _.map(selections, _.trim);
    const nonEmpty = _.filter(trimmed, (t) => t !== '');
    handleChange(nonEmpty);
  };

  render() {
    const { filterMap, column, values } = this.props;
    const value = _.get(filterMap, 'value', []);
    return (
      <Autocomplete
        multiple
        id={`autocomplete-${column.name}`}
        options={_.keys(values)}
        // this means the user's choice does not have to match the provided options
        freeSolo={true}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            margin="dense"
            onChange={this.onChange}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        onChange={this.onComplete}
        onKeyPress={this.handleReturn}
        value={value}
      />
    );
  }
}

export default FreetextFilter;
