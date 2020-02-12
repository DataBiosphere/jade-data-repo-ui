import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';

export class FreetextFilter extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    originalValues: PropTypes.object,
    values: PropTypes.object,
  };

  onComplete = (event, value) => {
    const { handleChange } = this.props;
    handleChange(value);
  };

  // getOptions = values => (values == null ? [] : _.keys(values));

  handleReturn = event => {
    const { handleFilters } = this.props;
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  render() {
    const { column, values } = this.props;
    return (
      <Autocomplete
        multiple
        id={`autocomplete-${column.name}`}
        options={_.keys(values)}
        // this means the user's choice does not have to match the provided options
        freeSolo={true}
        style={{ width: '100%' }}
        renderInput={params => <TextField {...params} fullWidth />}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        onChange={this.onComplete}
        onKeyPress={this.handleReturn}
      />
    );
  }
}

export default FreetextFilter;
