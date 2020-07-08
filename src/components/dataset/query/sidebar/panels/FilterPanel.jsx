import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Grid, InputBase, ListItem, Collapse } from '@material-ui/core';
import { ExpandMore, ExpandLess, Search } from '@material-ui/icons';
import QueryViewSidebarItem from '../QueryViewSidebarItem';
import QuerySidebarPanel from '../QuerySidebarPanel';
import { applyFilters } from '../../../../../actions';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'grid',
    gridTemplateRows: 'calc(100vh - 125px) 100px',
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
    paddingTop: theme.spacing(1),
  },
  panelContent: {
    padding: `0px ${theme.spacing(2)}px`,
  },
  rowOne: {
    gridRowStart: 1,
    gridRowEnd: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  rowTwo: {
    gridRowStart: 2,
    gridRowEnd: 3,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
  },
  inputBase: {
    paddingLeft: theme.spacing(0.5),
  },
  filterListItem: {
    justifyContent: 'space-between',
    fontWeight: '500',
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
});

export class FilterPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
      searchString: '',
      openFilter: {},
    };
  }

  static propTypes = {
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

  handleSearchString = (event) => {
    this.setState({ searchString: event.target.value });
  };

  handleOpenFilter = (filter) => {
    const { openFilter } = this.state;
    if (filter === openFilter) {
      this.setState({ openFilter: {} });
    } else {
      this.setState({ openFilter: filter });
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
    } = this.props;
    const { searchString, openFilter } = this.state;
    const filteredColumns = table.columns.filter((column) => column.name.includes(searchString));

    return (
      <div className={classes.root}>
        <div className={classes.rowOne}>
          <Box className={!open ? classes.hide : ''}>
            <Grid container={true} spacing={1}>
              <Grid item xs={10} className={classes.sidebarTitle}>
                <Typography variant="h6" display="block">
                  Data Snapshot
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <div className={clsx(classes.filterPanel, { [classes.hide]: !open })}>
            <QuerySidebarPanel selected={selected} data-cy="snapshotCard" />
          </div>
          <ListItem button className={clsx(classes.searchBar, classes.panelContent)}>
            <Search color="primary" fontSize="small" />
            <InputBase
              placeholder="Search filters"
              className={classes.inputBase}
              onChange={this.handleSearchString}
            />
          </ListItem>
          {table &&
            table.name &&
            filteredColumns.map((c) => (
              <div
                className={clsx({ [classes.highlighted]: c === openFilter })}
                data-cy="filterItem"
                key={c.name}
              >
                <ListItem
                  button
                  className={classes.filterListItem}
                  onClick={() => this.handleOpenFilter(c)}
                >
                  {c.name}
                  {c === openFilter ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={c === openFilter} timeout="auto" className={classes.panelContent}>
                  <QueryViewSidebarItem
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
          <Button
            variant="contained"
            disabled={_.isEmpty(dataset.schema.assets)}
            className={clsx({
              [classes.hide]: !open,
              [classes.tooltip]: _.isEmpty(dataset.schema.assets),
            })}
            onClick={() => handleCreateSnapshot(true)}
            data-cy="createSnapshot"
          >
            Create Snapshot
          </Button>
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
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(FilterPanel));
