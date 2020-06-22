import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel, Checkbox, Typography } from '@material-ui/core';
import BigQuery from 'modules/bigquery';

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
  constructor(props) {
    super(props);

    console.log('in constructor');
    this.state = {
      options: [],
      inputValue: '',
    };
  }

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
    options: PropTypes.array,
    dataset: PropTypes.object,
    token: PropTypes.string,
  };

  onComplete = (event, value) => {
    const { column, dataset, tableName, token, filterStatement, joinStatement } = this.props;
    const bq = new BigQuery();
    console.log(event);
    console.log(value);
    bq.getAutocompleteForColumn(
      value,
      column.name,
      dataset,
      tableName,
      token,
      filterStatement,
      joinStatement,
    ).then((response) => {
      const transformedResponse = this.transformResponse(response);
      console.log('SETTING STATE' + value);
      this.setState({
        inputValue: value,
        options: transformedResponse,
      });
    });
  };

  transformResponse = (response) => {
    const options = [];
    if (response) {
      response.map((r) => {
        const name = r.f[0].v;
        options.push(name);
      });
    }
    return options;
  };

  handleReturn = (event) => {
    const { handleFilters } = this.props;
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  onPaste = (event) => {
    const { handleChange } = this.props;
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty = selections.filter((s) => s !== '');
    handleChange(nonEmpty);
  };

  deleteChip = (option) => {
    const { handleChange, filterMap } = this.props;
    const selected = _.filter(filterMap.value, (v) => v !== option);
    handleChange(selected);
  };

  render() {
    const { classes, filterMap, column, values, toggleExclude } = this.props;
    const { options, inputValue } = this.state;
    const value = _.get(filterMap, 'value', []);

    return (
      <div>
        <Autocomplete
          multiple
          id={`autocomplete-${column.name}`}
          options={options}
          // this means the user's choice does not have to match the provided options
          freeSolo={true}
          style={{ width: '100%' }}
          renderInput={(params) => (
            <TextField {...params} fullWidth variant="outlined" margin="dense" />
          )}
          // tags are rendered manually in list under autocomplete box
          renderTags={() => null}
          onInputChange={this.onComplete}
          onKeyPress={this.handleReturn}
          onPaste={this.onPaste}
          value={value}
          forcePopupIcon
          disableClearable
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
            label={<Typography variant="body2">Exclude all</Typography>}
            data-cy={`exclude-${column.name}`}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(FreetextFilter);
