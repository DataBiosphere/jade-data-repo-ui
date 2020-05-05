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
          <TextField {...params} fullWidth variant="outlined" margin="dense" />
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
