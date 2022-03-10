import React from 'react';
import PropTypes from 'prop-types';
import JadeDropdown from '../../dataset/query/JadeDropdown';

export class QueryViewDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    const { onSelectedItem, options } = this.props;
    this.state = {
      table: options[0],
    };
    onSelectedItem(options[0]);
  }

  static propTypes = {
    onSelectedItem: PropTypes.func,
    options: PropTypes.array,
  };

  handleChange = (event) => {
    const { onSelectedItem } = this.props;
    this.setState({ table: event.target.value });
    onSelectedItem(event.target.value);
  };

  render() {
    const { options } = this.props;
    const { table } = this.state;

    return (
      <JadeDropdown
        onSelectedItem={this.handleChange}
        options={options}
        value={table}
        name="Select Table"
      />
    );
  }
}

export default QueryViewDropdown;
