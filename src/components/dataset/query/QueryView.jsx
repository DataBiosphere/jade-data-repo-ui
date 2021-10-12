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
  getBillingProfileById,
} from 'actions/index';
import { Typography } from '@material-ui/core';
import { FilterList, Info, People } from '@material-ui/icons';

import QueryViewSidebar from './sidebar/QueryViewSidebar';
import SidebarDrawer from './sidebar/SidebarDrawer';
import QueryViewDropdown from './QueryViewDropdown';
import JadeTable from '../../table/JadeTable';
import InfoView from './sidebar/panels/InfoView';
import ShareSnapshot from './sidebar/panels/ShareSnapshot';
import SnapshotPopup from '../../snapshot/SnapshotPopup';

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

export class QueryView extends React.PureComponent {
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
    queryResults: PropTypes.object,
    profile: PropTypes.object,
    table: PropTypes.object,
  };

  componentDidMount() {
    const { dispatch, match, dataset, datasetPolicies } = this.props;
    const datasetId = match.params.uuid;

    if (dataset == null || dataset.id !== datasetId) {
      dispatch(getDatasetById(datasetId));
    }

    if (datasetPolicies == null || dataset.id !== datasetId) {
      dispatch(getDatasetPolicy(datasetId));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { dataset, dispatch, filterStatement, joinStatement, orderBy, profile } = this.props;
    const { selected, canLink } = this.state;

    if (
      this.hasDataset() &&
      dataset.defaultProfileId &&
      canLink === false &&
      Object.keys(prevProps.profile).length === 0
    ) {
      dispatch(getBillingProfileById(dataset.defaultProfileId));
    }

    if (profile.id && canLink === false) {
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
          SELECT ${selected}.* ${fromClause}
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
        width: 800,
        component: InfoView,
        table,
        dataset,
      },
      {
        icon: FilterList,
        width: 400,
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
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Typography variant="h5" className={classes.headerArea}>
                {dataset.name}
              </Typography>
              <QueryViewDropdown options={names} onSelectedItem={this.handleChange} />
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
    canLink: state.canLink,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(QueryView));
