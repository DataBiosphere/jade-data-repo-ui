import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Typography,
  Button,
  Grid,
  InputBase,
  ListItem,
  Collapse,
  Divider,
  TextField,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import TerraTooltip from 'components/common/TerraTooltip';
import DataViewSidebarItem from '../DataViewSidebarItem';
import DataSidebarPanel from '../DataSidebarPanel';
import FreetextFilter from '../filter/FreetextFilter';

import { applyFilters } from '../../../../../actions';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
  hide: {
    display: 'none',
  },
  filterPanel: {
    marginBottom: '8px',
  },
  sidebarTitle: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
  },
  snapshotBtnCntnr: {
    textAlign: 'end',
  },
  panelContent: {
    padding: `0px ${theme.spacing(2)}`,
  },
  rowOne: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  rowTwo: {},
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
  },
  inputBase: {
    width: '100%',
  },
  filterListItem: {
    justifyContent: 'space-between',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  highlighted: {
    backgroundColor: theme.palette.primary.focus,
    borderRadius: theme.shape.borderRadius,
    paddingBottom: theme.spacing(0.5),
  },
  tooltip: {
    pointerEvents: 'auto !important',
    color: 'red',
  },
  button: {
    marginTop: theme.spacing(1),
  },
});

export class FilterPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
      searchInput: '',
      searchStrings: [],
      openFilter: '',
    };
  }

  static propTypes = {
    canLink: PropTypes.bool,
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
    handleCreateSnapshot: PropTypes.func,
    joinStatement: PropTypes.string,
    open: PropTypes.bool,
    selected: PropTypes.string,
    table: PropTypes.object,
    token: PropTypes.string,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { filterMap } = this.state;

    if (!_.isEqual(nextProps.filterData, filterMap)) {
      this.setState({
        filterMap: nextProps.filterData,
      });
    }
  }

  handleChange = (column, filter, table) => {
    const { filterMap } = this.state;
    const clonedMap = _.cloneDeep(filterMap);
    if (filter.value == null || filter.value.length === 0) {
      delete clonedMap[table][column];
      if (_.isEmpty(clonedMap[table])) {
        delete clonedMap[table];
      }
    } else if (_.isPlainObject(clonedMap[table])) {
      clonedMap[table][column] = {
        exclude: filter.exclude,
        value: filter.value,
        type: filter.type,
      };
    } else {
      clonedMap[table] = {
        [column]: {
          exclude: filter.exclude,
          value: filter.value,
          type: filter.type,
        },
      };
    }
    this.setState({ filterMap: clonedMap }, this.handleFilters);
  };

  handleFilters = () => {
    const { dispatch, table, dataset } = this.props;
    const { filterMap } = this.state;
    const tableName = table.name;
    dispatch(applyFilters(filterMap, tableName, dataset));
  };

  onPaste = (event) => {
    event.preventDefault();
    const { searchStrings } = this.state;
    const text = event.clipboardData.getData('text');
    const selections = text.split(/[ ,\n]+/);
    const nonEmpty = selections.filter((s) => s !== '');
    const updatedValueArray = searchStrings.concat(nonEmpty);
    this.setState({ searchStrings: updatedValueArray });
  };

  handleSearchString = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  handleReturn = (event) => {
    const { searchStrings, searchInput } = this.state;
    if (event.key === 'Enter' && searchInput) {
      this.setState({
        searchInput: '',
        searchStrings: [...searchStrings, searchInput],
      });
    }
  };

  handleSearchFilter = (event, value) => {
    this.setState({ searchStrings: value, searchInput: '' });
  };

  handleOpenFilter = (filter) => {
    const { openFilter } = this.state;
    if (filter.name === openFilter) {
      this.setState({ openFilter: '' });
    } else {
      this.setState({ openFilter: filter.name });
    }
  };

  render() {
    const {
      classes,
      dataset,
      filterData,
      filterStatement,
      open,
      table,
      token,
      joinStatement,
      selected,
      handleCreateSnapshot,
      canLink,
    } = this.props;
    const { searchStrings, searchInput, openFilter } = this.state;
    const filteredColumns = table.columns
      .filter((column) => {
        const stringsToCheck = [...searchStrings, searchInput]
          .filter((str) => !!str)
          .map((searchStr) => column.name.includes(searchStr))
          .filter((hasMatch) => hasMatch);
        return stringsToCheck.length > 0 || (searchStrings.length === 0 && !searchInput);
      })
      .map((column) => ({
        dataType: column.datatype,
        arrayOf: column.array_of,
        name: column.name,
      }));

    const billingErrorMessage =
      "You cannot create a snapshot because you do not have access to the dataset's billing profile.";

    return (
      <div className={classes.root}>
        <div className={classes.rowOne}>
          <Box className={!open ? classes.hide : ''}>
            <Grid container={true} spacing={1}>
              <Grid item xs={10} className={classes.sidebarTitle}>
                <Typography variant="h6" display="block">
                  Select Data
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <div className={clsx(classes.filterPanel, { [classes.hide]: !open })}>
            <DataSidebarPanel selected={selected} data-cy="snapshotCard" />
          </div>
          <Autocomplete
            className={classes.inputBase}
            multiple
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                className={classes.input}
                placeholder="Search filters"
                onChange={this.handleSearchString}
                onKeyDown={this.handleReturn}
                onPaste={this.onPaste}
                data-cy="enterEmailBox"
              />
            )}
            onChange={this.handleSearchFilter}
            value={searchStrings}
            inputValue={searchInput}
            options={[]}
          />
          {table &&
            table.name &&
            filteredColumns.map((c) => (
              <div
                className={clsx({ [classes.highlighted]: c.name === openFilter })}
                data-cy="filterItem"
                key={c.name}
              >
                <ListItem
                  button
                  className={classes.filterListItem}
                  onClick={() => this.handleOpenFilter(c)}
                >
                  {c.name}
                  {c.name === openFilter ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={c.name === openFilter}
                  timeout="auto"
                  className={classes.panelContent}
                >
                  <DataViewSidebarItem
                    column={c}
                    dataset={dataset}
                    filterData={filterData}
                    filterStatement={filterStatement}
                    joinStatement={joinStatement}
                    handleChange={this.handleChange}
                    handleFilters={this.handleFilters}
                    tableName={table.name}
                    token={token}
                  />
                </Collapse>
              </div>
            ))}
        </div>
        <div className={clsx(classes.rowTwo, classes.snapshotBtnCntnr)}>
          <Divider />
          <TerraTooltip title={canLink ? '' : billingErrorMessage}>
            <span>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                disabled={_.isEmpty(dataset.schema.assets) || !canLink}
                className={clsx(
                  {
                    [classes.hide]: !open,
                    [classes.tooltip]: _.isEmpty(dataset.schema.assets),
                  },
                  classes.button,
                )}
                onClick={() => handleCreateSnapshot(true)}
                data-cy="createSnapshot"
              >
                Create Snapshot
              </Button>
            </span>
          </TerraTooltip>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    joinStatement: state.query.joinStatement,
    token: state.user.delegateToken,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(FilterPanel));
