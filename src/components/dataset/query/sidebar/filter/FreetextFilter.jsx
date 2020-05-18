import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel, Checkbox, Typography } from '@material-ui/core';

const styles = (theme) => ({
  listItem: {
    margin: `${theme.spacing(0.5)}px 0px`,
  },
  chip: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
});

export class FreetextFilter extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    column: PropTypes.object,
    filterMap: PropTypes.object,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    originalValues: PropTypes.object,
    table: PropTypes.string,
    toggleExclude: PropTypes.func,
    values: PropTypes.object,
  };

  onComplete = (event, value) => {
    const { handleChange } = this.props;
    handleChange(value);
  };

  handleReturn = (event) => {
    const { handleFilters } = this.props;
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  onChange = (event) => {
    const { handleChange } = this.props;
    const { value } = event.target;
    let selections;
    if (value.includes(',')) {
      selections = value.split(',');
    } else if (value.includes(' ')) {
      selections = value.split(' ');
    } else {
      return;
    }
    const trimmed = _.map(selections, _.trim);
    const nonEmpty = _.filter(trimmed, (t) => t !== '');
    handleChange(nonEmpty);
  };

  deleteChip = (option) => {
    const { handleChange, filterMap } = this.props;
    const selected = _.filter(filterMap.value, (v) => v !== option);
    handleChange(selected);
  };

  render() {
    const { classes, filterMap, column, values, toggleExclude } = this.props;
    const value = _.get(filterMap, 'value', []);
    return (
      <div>
        <Autocomplete
          multiple
          id={`autocomplete-${column.name}`}
          options={_.keys(values)}
          // this means the user's choice does not have to match the provided options
          freeSolo={true}
          style={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              margin="dense"
              onChange={this.onChange}
            />
          )}
          // tags are rendered manually in list under autocomplete box
          renderTags={() => null}
          onChange={this.onComplete}
          onKeyPress={this.handleReturn}
          value={value}
        />
        {value.map((option, index) => (
          <div key={index} className={classes.listItem}>
            <Chip
              label={option}
              onDelete={() => this.deleteChip(option)}
              variant="outlined"
              className={classes.chip}
            />
          </div>
        ))}
        {!_.isEmpty(value) && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={filterMap.exclude}
                onChange={(event) => toggleExclude(event.target.checked)}
              />
            }
            label={<Typography variant="body2">Exclude this selection</Typography>}
            data-cy={`exclude-${column.name}`}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(FreetextFilter);
