import React, { Fragment, useState, useEffect } from 'react';
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

function DatasetQueryView({
  classes,
  dataset,
  datasetLoading,
  datasetPolicies,
  dispatch,
  filterData,
  filterStatement,
  joinStatement,
  match,
  orderBy,
  profile,
  queryResults,
  table,
  userRole,
}) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [canLink, setCanLink] = useState(false);

  const getSelectColumns = () => {
    return `datarepo_row_id, ${selectedTable.columns.map((column) => column.name).join(', ')}`;
  };

  useEffect(() => {
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
  }, [dispatch, match, dataset, datasetPolicies, userRole]);

  useEffect(() => {
    if (!datasetLoading) {
      const fromClause = `FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${selected}\` AS ${selected}
          ${joinStatement}
          ${filterStatement}`;

      const { tables } = dataset.schema;
      setSelectedTable(tables.find((t) => t.name === selected));

      dispatch(
        runQuery(
          dataset.dataProject,
          `#standardSQL
          SELECT ${getSelectColumns()} ${fromClause}
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
  }, [dataset, datasetLoading, dispatch, filterStatement, joinStatement, orderBy, selected]);

  useEffect(() => {
    // don't want want to check that the user has access to this profile id?
    if (profile.id) {
      setCanLink(true);
    }
  }, [profile]);

  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChange = (value) => {
    setSelected(value);
    setSelectedTable(dataset.schema.tables.find((t) => t.name === value));
    dispatch(applyFilters(filterData, value, dataset));
  };

  const getPanels = () => {
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

  return (
    <div>
      {datasetLoading && <div>Loading</div>}
      {!datasetLoading && (
        <Fragment>
          <Grid container spacing={0} className={classes.wrapper}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h3" className={classes.headerArea}>
                  {dataset.name}
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <QueryViewDropdown options={dataset.schema.tables.map((t) => t.name)} onSelectedItem={handleChange} />
              </Grid>
              <Grid item xs={3}>
                <Link to="details">
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
            panels={getPanels(table, dataset)}
            handleDrawerWidth={handleDrawerWidth}
            width={sidebarWidth}
            table={table}
            selected={selected}
          />
          <SnapshotPopup />
        </Fragment>
      )}
    </div>
  );
}

DatasetQueryView.propTypes = {
  classes: PropTypes.object,
  datasetLoading: PropTypes.bool,
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

function mapStateToProps(state) {
  return {
    datasetLoading: state.datasets.datasetLoading,
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
