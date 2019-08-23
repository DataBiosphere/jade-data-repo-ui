import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
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

    this.state = {
      values: {
        table: '',
        name: '',
      },
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    options: PropTypes.array,
  };

  handleChange = event => {
    this.setState({
      values: { ...this.values, [event.target.name]: event.target.value },
    });
  };

  render() {
    const { classes, options } = this.props;
    const { values } = this.state;

    return (
      <form autoComplete="off">
        <FormControl className={classes.root}>
          <InputLabel htmlFor="table-select">Table</InputLabel>
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
