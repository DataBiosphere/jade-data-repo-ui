import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export class FreetextFilter extends React.PureComponent {
  static propTypes = {
    column: PropTypes.object,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    values: PropTypes.array,
  };

  onComplete = (event, value) => {
    const { handleChange } = this.props;
    handleChange(value);
  };

  getOptions = values => values.map(a => a.f[0].v);

  render() {
    const { column, values } = this.props;
    return (
      <Autocomplete
        id={`autocomplete-${column.name}`}
        options={this.getOptions(values)}
        // this means the user's choice does not have to match the provided options
        freeSolo={true}
        style={{ width: '100%' }}
        renderInput={params => <TextField {...params} fullWidth />}
        onChange={this.onComplete}
      />
    );
  }
}

export default FreetextFilter;
