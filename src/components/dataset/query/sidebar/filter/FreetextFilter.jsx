import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Input from '@material-ui/core/Input';

export class FreetextFilter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      prevPropsFilterData: props.filterData,
      currValue: '',
    };
  }

  static propTypes = {
    column: PropTypes.object,
    filterData: PropTypes.object,
    handleChange: PropTypes.func,
  };

  static getDerivedStateFromProps(props, state) {
    if (!_.isEqual(props.filterData, state.prevPropsFilterData)) {
      return {
        currValue: _.get(props.filterData, `${props.column.name}`, ''),
        prevPropsFilterData: props.filterData,
      };
    }
    return null;
  }

  handleChange = event => {
    const { handleChange } = this.props;
    this.setState({
      currValue: event.target.value,
    });
    handleChange(event);
  };

  render() {
    const { column } = this.props;
    const { currValue } = this.state;
    return (
      <Input
        placeholder={column.name}
        onChange={this.handleChange}
        inputProps={{
          'aria-label': 'description',
        }}
        value={currValue}
      />
    );
  }
}

export default FreetextFilter;
