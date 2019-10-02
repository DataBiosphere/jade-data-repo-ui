import React from 'react';
import BigQuery from 'modules/bigquery';
import PropTypes from 'prop-types';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export class CategoryFilter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
    };
  }

  static propTypes = {
    handleChange: PropTypes.func,
    name: PropTypes.string,
  };

  handleChange = event => {
    const { handleChange } = this.props;
    this.setState({
      checked: event.target.checked,
    });
    handleChange();
  };

  render() {
    const { checked } = this.state;
    const { name } = this.props;
    return (
      <FormControlLabel
        control={
          <Checkbox checked={checked} onChange={this.handleChange} value={name} color="primary" />
        }
        label="Primary"
      />
    );
  }
}
