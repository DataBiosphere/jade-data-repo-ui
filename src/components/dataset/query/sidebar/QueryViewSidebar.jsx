import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Box,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Button,
  Grid,
  InputBase,
} from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';
import QueryViewSidebarItem from './QueryViewSidebarItem';
import QuerySidebarPanel from './QuerySidebarPanel';
import { applyFilters, openSnapshotDialog } from '../../../../actions';
import { push } from 'modules/hist';
import CreateSnapshotPanel from './panels/CreateSnapshotPanel';
import { fade } from '@material-ui/core/styles/colorManipulator';

const drawerWidth = 400;

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
    display: 'grid',
  },
  defaultGrid: {
    gridTemplateRows: 'calc(100vh - 125px) 100px',
  },
  createSnapshotGrid: {
    gridTemplateRows: 'calc(100vh - 200px) 125px',
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
  jadeExpansionPanel: {
    margin: '10px',
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
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.2),
    },
    borderRadius: '4px',
    marginBottom: '4px',
    padding: '0px 4px 0px 8px',
  },
  inputBase: {
    paddingLeft: '4px',
  },
});

export class QueryViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
      isSavingSnapshot: false,
      searchString: '',
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

  handleCreateSnapshot = isSaving => {
    this.setState({ isSavingSnapshot: isSaving });
  };

  handleChange = (filter, table) => {
    const { filterMap } = this.state;
    const clonedMap = _.cloneDeep(filterMap);
    if (filter.value == null || filter.value.length === 0) {
      delete clonedMap[table][filter.name];
      if (_.isEmpty(clonedMap[table])) {
        delete clonedMap[table];
      }
    } else if (_.isPlainObject(clonedMap[table])) {
      clonedMap[table][filter.name] = {
        value: filter.value,
        type: filter.type,
      };
    } else {
      clonedMap[table] = {
        [filter.name]: {
          value: filter.value,
          type: filter.type,
        },
      };
    }
    this.setState({ filterMap: clonedMap });
  };

  handleFilters = () => {
    const { dispatch, table, dataset } = this.props;
    const { filterMap } = this.state;
    const tableName = table.name;
    dispatch(applyFilters(filterMap, dataset.schema.relationships, tableName, dataset));
  };

  handleSaveSnapshot = () => {
    const { dispatch } = this.props;
    push('/snapshots');
    dispatch(openSnapshotDialog(true));
  };

  handleSearchString = event => {
    this.setState({ searchString: event.target.value });
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
    const { isSavingSnapshot, searchString } = this.state;
    const filteredColumns = table.columns.filter(column => column.name.startsWith(searchString));

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
            <QuerySidebarPanel selected={selected} />
          </div>
          <div className={classes.searchBar}>
            <Search color="primary" fontSize={'small'} />
            <InputBase
              placeholder="Search filters"
              className={classes.inputBase}
              onChange={this.handleSearchString}
            />
          </div>
          {table &&
            table.name &&
            filteredColumns.map(c => (
              <ExpansionPanel
                key={c.name}
                className={clsx(classes.panelBottomBorder, { [classes.hide]: !open })}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMore />}
                  aria-controls={`panel-content-${c.name}`}
                  id={`panel-header-${c.name}`}
                >
                  <Typography className={classes.heading}>{c.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.jadeExpansionPanel}>
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
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
        </div>
        {!isSavingSnapshot && (
          <div className={classes.rowTwo}>
            <div>
              <Button
                variant="contained"
                className={clsx(classes.stickyButton, { [classes.hide]: !open })}
                onClick={this.handleFilters}
              >
                Apply Filters
              </Button>
            </div>
            <div className={classes.snapshotButtonContainer}>
              <Button
                variant="contained"
                className={clsx(classes.stickyButton, classes.snapshotButton, {
                  [classes.hide]: !open,
                })}
                onClick={() => this.handleCreateSnapshot(true)}
              >
                Create Snapshot
              </Button>
            </div>
          </div>
        )}
        {isSavingSnapshot && (
          <CreateSnapshotPanel
            handleCreateSnapshot={this.handleCreateSnapshot}
            handleSaveSnapshot={this.handleSaveSnapshot}
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
