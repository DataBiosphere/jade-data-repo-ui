import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import JadeDropdown from './JadeDropdown';

const styles = () => ({
  root: {
    width: '100%',
  },
});

export class QueryViewDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    const { onSelectedItem, options } = this.props;

    this.state = {
      values: {
        table: options[0],
        name: '',
      },
    };
    onSelectedItem(options[0]);
  }

  static propTypes = {
    classes: PropTypes.object,
    onSelectedItem: PropTypes.func,
    options: PropTypes.array,
  };

  handleChange = (event) => {
    const { onSelectedItem } = this.props;
    this.setState({
      values: { ...this.values, [event.target.name]: event.target.value },
    });
    onSelectedItem(event.target.value);
  };

  render() {
    const { classes, options } = this.props;
    const { values } = this.state;

    return (
      <JadeDropdown
        onSelectedItem={this.handleChange}
        options={options}
        value={values.table}
        name="Select Table"
      />
    );
  }
}

export default withStyles(styles)(QueryViewDropdown);
