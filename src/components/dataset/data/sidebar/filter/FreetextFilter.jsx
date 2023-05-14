import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { withStyles } from '@mui/styles';
import { FormControlLabel, Checkbox, Typography } from '@mui/material';
import BigQuery from 'modules/filter';
import { ResourceType } from '../../../../../constants';

const styles = (theme) => ({
  listItem: {
    margin: `${theme.spacing(0.5)} 0px`,
  },
  chip: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
});

export class FreetextFilter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    column: PropTypes.object,
    dataset: PropTypes.object,
    filterMap: PropTypes.object,
    handleChange: PropTypes.func,
    handleFilters: PropTypes.func,
    table: PropTypes.string,
    tableName: PropTypes.string,
    toggleExclude: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.object),
  };

  onInputChange = async (event) => {
    const { value } = event.target;

    this.setState({
      inputValue: value,
    });
  };

  onChange = (event, value) => {
    const { handleChange } = this.props;
    this.setState({ inputValue: '' });
    handleChange(value);
  };

  handleReturn = (event) => {
    const { handleFilters } = this.props;
    if (event.key === 'Enter') {
      handleFilters();
    }
  };

  onPaste = (event) => {
    const { handleChange, filterMap } = this.props;
    event.preventDefault();
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty = selections.filter((s) => s !== '');
    const updatedValueArray = _.get(filterMap, 'value', []).concat(nonEmpty);
    handleChange(updatedValueArray);
  };

  deleteChip = (option) => {
    const { handleChange, filterMap } = this.props;
    const selected = _.filter(filterMap.value, (v) => v !== option);
    handleChange(selected);
  };

  render() {
    const { classes, filterMap, column, toggleExclude, values } = this.props;
    const { inputValue } = this.state;
    const value = _.get(filterMap, 'value', []);
    const valueList = values?.map((val) => val.value) ?? [];

    return (
      <div>
        <Autocomplete
          multiple
          id={`autocomplete-${column.name}`}
          options={valueList}
          // this means the user's choice does not have to match the provided options
          freeSolo={true}
          style={{ width: '100%' }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              margin="dense"
              onChange={this.onInputChange}
            />
          )}
          // tags are rendered manually in list under autocomplete box
          renderTags={() => null}
          inputValue={inputValue}
          onKeyPress={this.handleReturn}
          onPaste={this.onPaste}
          onChange={this.onChange}
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

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(FreetextFilter));
