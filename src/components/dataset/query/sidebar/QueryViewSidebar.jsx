import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Grid,
  InputBase,
  ListItem,
  Collapse,
  Tooltip,
} from '@material-ui/core';
import { ExpandMore, ExpandLess, Search } from '@material-ui/icons';
import QueryViewSidebarItem from './QueryViewSidebarItem';
import QuerySidebarPanel from './QuerySidebarPanel';
import { applyFilters, openSnapshotDialog, createSnapshot } from '../../../../actions';
import CreateSnapshotPanel from './panels/CreateSnapshotPanel';
import { push } from 'modules/hist';

const drawerWidth = 400;

const styles = (theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'grid',
  },
  defaultGrid: {
    gridTemplateRows: 'calc(100vh - 125px) 100px',
  },
  createSnapshotGrid: {
    gridTemplateRows: 'calc(100vh - 275px) 200px',
  },
  hide: {
    display: 'none',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  filterPanel: {
    marginBottom: '8px',
  },
  sidebarTitle: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
  },
  panelBottomBorder: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  stickyButton: {
    position: '-webkit-sticky',
    // eslint-disable-next-line no-dupe-keys
    position: 'fixed',
    bottom: '0',
    marginBottom: theme.spacing(1),
    width: drawerWidth / 2 - theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.hover,
    },
  },
  snapshotButton: {
    backgroundColor: `${theme.palette.primary.dark} !important`,
  },
  snapshotButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
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
    borderRadius: '4px',
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
    borderRadius: '4px',
    paddingBottom: theme.spacing(0.5),
  },
  tooltip: {
    pointerEvents: 'auto !important',
    color: 'red',
  },
});

export class QueryViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
      isSavingSnapshot: false,
      searchString: '',
      openFilter: {},
      selectedAsset: {},
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
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

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleCreateSnapshot = (isSaving) => {
    this.setState({ isSavingSnapshot: isSaving });
  };

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

  handleSaveSnapshot = () => {
    const { dispatch, selected } = this.props;
    dispatch(createSnapshot());
    dispatch(openSnapshotDialog(true));
    push('/snapshots');
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

  handleSelectAsset = (event) => {
    const { dataset } = this.props;

    const selectedAsset = _.find(dataset.schema.assets, ['name', event.target.value]);
    this.setState({
      selectedAsset,
    });
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
    } = this.props;
    const { isSavingSnapshot, searchString, openFilter, selectedAsset } = this.state;
    const filteredColumns = table.columns.filter((column) => column.name.includes(searchString));

    return (
      <div
        className={clsx(classes.root, {
          [classes.defaultGrid]: !isSavingSnapshot,
          [classes.createSnapshotGrid]: isSavingSnapshot,
        })}
      >
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
            <Search color="primary" fontSize={'small'} />
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
        {!isSavingSnapshot && (
          <div className={classes.rowTwo}>
            <Tooltip
              title={_.isEmpty(dataset.schema.assets) ? 'Please add an asset to this dataset' : ''}
            >
              <div className={classes.snapshotButtonContainer}>
                <Button
                  variant="contained"
                  disabled={_.isEmpty(dataset.schema.assets)}
                  className={clsx(classes.stickyButton, classes.snapshotButton, {
                    [classes.hide]: !open,
                    [classes.tooltip]: _.isEmpty(dataset.schema.assets),
                  })}
                  onClick={() => this.handleCreateSnapshot(true)}
                  data-cy="createSnapshot"
                >
                  Create Snapshot
                </Button>
              </div>
            </Tooltip>
          </div>
        )}
        {isSavingSnapshot && (
          <CreateSnapshotPanel
            dataset={dataset}
            handleCreateSnapshot={this.handleCreateSnapshot}
            handleSaveSnapshot={this.handleSaveSnapshot}
            handleSelectAsset={this.handleSelectAsset}
          />
        )}
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

export default connect(mapStateToProps)(withStyles(styles)(QueryViewSidebar));
