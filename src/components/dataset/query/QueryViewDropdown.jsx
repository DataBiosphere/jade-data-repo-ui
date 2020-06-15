import React from 'react';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
  }

  static propTypes = {
    classes: PropTypes.object,
    onSelectedItem: PropTypes.func,
    options: PropTypes.array,
  };

  componentDidUpdate(prevProps) {
    const { options, onSelectedItem } = this.props;
    console.log(options);
    console.log(prevProps.options);
    console.log(options !== prevProps.options);
    if (!_.isEqual(options, prevProps.options)) {
      onSelectedItem(options[0]);
      this.setState({
        values: {
          table: options[0],
          name: '',
        },
      });
    }
  }

  handleChange = event => {
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
      <form autoComplete="off">
        <FormControl variant="outlined" className={classes.root}>
          <Select
            value={values.table}
            onChange={this.handleChange}
            inputProps={{
              name: 'table',
              id: 'table-select',
            }}
          >
            {options.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(QueryViewDropdown);
