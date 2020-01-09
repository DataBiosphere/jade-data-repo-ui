import React from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import { Box } from '@material-ui/core';
import QueryViewSidebarItem from './QueryViewSidebarItem';
import QuerySidebarPanel from './QuerySidebarPanel';
import { applyFilters } from '../../../../actions';

const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'block',
    margin: theme.spacing(1),
  },
  menuButton: {
    'border-radius': '0%',
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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  noMargin: {
    margin: '0px',
  },
  filterPanel: {
    paddingBottom: '10px',
  },
  sidebarTitle: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'center',
  },
  panelBottomBorder: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  panelTopBorder: {
    borderTop: `1px solid ${theme.palette.divider}`,
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
});

export class QueryViewSidebar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterMap: {},
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
    open: PropTypes.bool,
    table: PropTypes.object,
    token: PropTypes.string,
  };

  componentWillReceiveProps(nextProps) {
    const { filterMap } = this.state;

    if (!_.isEqual(nextProps.filterData, filterMap)) {
      this.setState({
        filterMap: nextProps.filterData,
      });
    }
  }

  handleChange = value => {
    const { filterMap } = this.state;
    const clonedMap = _.clone(filterMap);

    if (value.value == null || value.value.length === 0) {
      delete clonedMap[value.name];
    } else {
      clonedMap[value.name] = value.value;
    }
    this.setState({ filterMap: clonedMap });
  };

  handleFilters = () => {
    const { dispatch } = this.props;
    const { filterMap } = this.state;

    dispatch(applyFilters(filterMap));
  };

  render() {
    const { classes, dataset, filterData, filterStatement, open, table, token } = this.props;

    return (
      <div className={classes.root}>
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
          <QuerySidebarPanel />
        </div>
        <Divider />
        {table &&
          table.name &&
          table.columns.map(c => (
            <ExpansionPanel
              key={c.name}
              className={clsx(classes.panelBottomBorder, { [classes.hide]: !open })}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
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
                  handleChange={this.handleChange}
                  handleFilters={this.handleFilters}
                  tableName={table.name}
                  token={token}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        <div>
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
              disabled
              className={clsx(classes.stickyButton, classes.snapshotButton, {
                [classes.hide]: !open,
              })}
            >
              Create Snapshot
            </Button>
          </div>
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
    token: state.user.token,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QueryViewSidebar));
