import React from 'react';
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

export class JadeDropdown extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    onSelectedItem: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.string,
  };

  render() {
    const { classes, options, onSelectedItem, value } = this.props;

    return (
      <form autoComplete="off">
        <FormControl variant="outlined" className={classes.root}>
          <Select
            value={value}
            onChange={(event) => onSelectedItem(event)}
            inputProps={{
              name: 'table', // TODO: this needs to be generalized
              id: 'table-select',
            }}
            displayEmpty
            renderValue={(value) => (!value ? 'Select Asset' : value)}
          >
            {options.map((name) => (
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

export default withStyles(styles)(JadeDropdown);
