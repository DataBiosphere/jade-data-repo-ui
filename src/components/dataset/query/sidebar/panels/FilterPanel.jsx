import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Grid,
  InputBase,
  ListItem,
  Collapse,
  Divider,
} from '@mui/material';
import { ExpandMore, ExpandLess, Search } from '@mui/icons-material';
import QueryViewSidebarItem from '../QueryViewSidebarItem';
import QuerySidebarPanel from '../QuerySidebarPanel';
import { applyFilters } from '../../../../../actions';
import TerraTooltip from '../../../../common/TerraTooltip';

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
  button: {
    marginTop: theme.spacing(1),
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
      canLink,
    } = this.props;
    const { searchString, openFilter } = this.state;
    const filteredColumns = table.columns.filter((column) => column.name.includes(searchString));
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
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(FilterPanel));
