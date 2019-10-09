import React from 'react';
import _ from 'lodash';
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
    column: PropTypes.object,
    count: PropTypes.string,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
    name: PropTypes.string,
  };

  componentWillReceiveProps(nextProps) {
    const { column, filterData } = this.props;
    const currFilter = _.get(nextProps.filterData, column.name);

    if (nextProps.filterData !== filterData && currFilter === undefined) {
      this.setState({
        checked: false,
      });
    }
  }

  handleChange = event => {
    const { handleChange, name } = this.props;
    this.setState({
      checked: event.target.checked,
    });
    handleChange({
      name,
      value: event.target.checked,
    });
  };

  render() {
    const { checked } = this.state;
    const { name, count } = this.props;
    return (
      <FormControlLabel
        control={
          <Checkbox checked={checked} onChange={this.handleChange} value={name} color="primary" />
        }
        label={`${name} (${count})`}
      />
    );
  }
}
