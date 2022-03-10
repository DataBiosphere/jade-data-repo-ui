import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import {
  applyFilters,
  runQuery,
  getDatasetById,
  getDatasetPolicy,
  countResults,
  getUserDatasetRoles,
} from 'actions/index';
import { Button, Typography } from '@material-ui/core';
import { FilterList, Info, People } from '@material-ui/icons';

import { Link } from 'react-router-dom';
import QueryViewSidebar from './sidebar/QueryViewSidebar';
import SidebarDrawer from './sidebar/SidebarDrawer';
import QueryViewDropdown from './QueryViewDropdown';
import JadeTable from '../../table/JadeTable';
import InfoView from './sidebar/panels/InfoView';
import ShareSnapshot from './sidebar/panels/ShareSnapshot';
import SnapshotPopup from '../../snapshot/SnapshotPopup';
import { DATASET_INCLUDE_OPTIONS } from '../../../constants';

const styles = (theme) => ({
  wrapper: {
    paddingTop: theme.spacing(0),
    padding: theme.spacing(4),
  },
  scrollTable: {
    overflowY: 'auto',
    height: '100%',
  },
  headerArea: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
});

const PAGE_SIZE = 100;
const QUERY_LIMIT = 1000;

export class DatasetQueryView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: '',
      table: null,
      sidebarWidth: 0,
      canLink: false,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    dataset: PropTypes.object,
    datasetPolicies: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    filterData: PropTypes.object,
    filterStatement: PropTypes.string,
    joinStatement: PropTypes.string,
    match: PropTypes.object,
    orderBy: PropTypes.string,
    profile: PropTypes.object,
    queryResults: PropTypes.object,
    table: PropTypes.object,
    userRole: PropTypes.array,
  };

  componentDidMount() {
    const { dispatch, match, dataset, datasetPolicies, userRole } = this.props;
    const datasetId = match.params.uuid;

    if (dataset == null || dataset.id !== datasetId) {
      dispatch(
        getDatasetById({
          datasetId,
          include: [
            DATASET_INCLUDE_OPTIONS.SCHEMA,
            DATASET_INCLUDE_OPTIONS.ACCESS_INFORMATION,
            DATASET_INCLUDE_OPTIONS.PROFILE,
            DATASET_INCLUDE_OPTIONS.DATA_PROJECT,
            DATASET_INCLUDE_OPTIONS.STORAGE,
          ],
        }),
      );
    }

    if (datasetPolicies == null || dataset.id !== datasetId) {
      dispatch(getDatasetPolicy(datasetId));
    }

    if (userRole == null || dataset.id !== datasetId) {
      dispatch(getUserDatasetRoles(datasetId));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { dataset, dispatch, filterStatement, joinStatement, orderBy, profile } = this.props;
    const { selected } = this.state;

    if (profile.id) {
      this.setState({ canLink: true });
    }

    if (
      this.hasDataset() &&
      (prevProps.filterStatement !== filterStatement ||
        prevState.selected !== selected ||
        prevProps.orderBy !== orderBy)
    ) {
      const fromClause = `FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${selected}\` AS ${selected}
          ${joinStatement}
          ${filterStatement}`;

      dispatch(
        runQuery(
          dataset.dataProject,
          `#standardSQL
          SELECT ${this.getSelectColumns()} ${fromClause}
          ${orderBy}
          LIMIT ${QUERY_LIMIT}`,
          PAGE_SIZE,
        ),
      );
      dispatch(
        countResults(
          dataset.dataProject,
          `#standardSQL
          SELECT COUNT(1) ${fromClause}`,
        ),
      );
    }
  }

  getSelectColumns() {
    const { dataset } = this.props;
    const { selected } = this.state;
    const { tables } = dataset.schema;
    const selectedTable = tables.find((table) => table.name === selected);
    return `datarepo_row_id, ${selectedTable.columns.map((column) => column.name).join(', ')}`;
  }

  hasDataset() {
    const { dataset, match } = this.props;
    const datasetId = match.params.uuid;
    return dataset && dataset.schema && dataset.id === datasetId;
  }

  handleDrawerWidth = (width) => {
    this.setState({ sidebarWidth: width });
  };

  handleChange = (value) => {
    const { dataset, dispatch, filterData } = this.props;
    const table = dataset.schema.tables.find((t) => t.name === value);
    this.setState({
      selected: value,
      table,
    });
    dispatch(applyFilters(filterData, value, dataset));
  };

  getPanels = () => {
    const { table, dataset } = this.props;
    const { canLink } = this.state;
    const panels = [
      {
        icon: Info,
        width: 600,
        component: InfoView,
        table,
        dataset,
      },
      {
        icon: FilterList,
        width: 600,
        component: QueryViewSidebar,
        table,
        dataset,
      },
    ];
    if (canLink) {
      panels.push({
        icon: People,
        width: 600,
        component: ShareSnapshot,
        table,
        dataset,
      });
    }
    return panels;
  };

  realRender() {
    const { classes, dataset, queryResults } = this.props;
    const { table, selected, sidebarWidth, canLink } = this.state;
    const names = dataset.schema.tables.map((t) => t.name);
    return (
      <Fragment>
        <Grid container spacing={0} className={classes.wrapper}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h3" className={classes.headerArea}>
                {dataset.name}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <QueryViewDropdown options={names} onSelectedItem={this.handleChange} />
            </Grid>
            <Grid item xs={3}>
              <Link to="overview">
                <Button
                  className={classes.viewDatasetButton}
                  color="primary"
                  variant="outlined"
                  disableElevation
                  size="large"
                >
                  Back to Dataset Details
                </Button>
              </Link>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xs={11}>
              <div className={classes.scrollTable}>
                <JadeTable queryResults={queryResults} title={selected} table={table} />
              </div>
            </Grid>
          </Grid>
        </Grid>
        <SidebarDrawer
          canLink={canLink}
          panels={this.getPanels(table, dataset)}
          handleDrawerWidth={this.handleDrawerWidth}
          width={sidebarWidth}
          table={table}
          selected={selected}
        />
        <SnapshotPopup />
      </Fragment>
    );
  }

  render() {
    if (this.hasDataset()) {
      return this.realRender();
    }
    // TODO change to actual loading spinner
    return <div>Loading</div>;
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    datasetPolicies: state.datasets.datasetPolicies,
    filterStatement: state.query.filterStatement,
    filterData: state.query.filterData,
    joinStatement: state.query.joinStatement,
    queryResults: state.query.queryResults,
    orderBy: state.query.orderBy,
    profile: state.profiles.profile,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetQueryView));
