import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  applyFilters,
  runQuery,
  getDatasetById,
  getDatasetPolicy,
  countResults,
  getUserDatasetRoles,
  pageQuery,
} from 'actions/index';
import { FilterList, Info, People } from '@material-ui/icons';

import QueryView from 'components/common/query/QueryView';
import LoadingSpinner from 'components/common/LoadingSpinner';
import QueryViewSidebar from './sidebar/QueryViewSidebar';
import InfoView from './sidebar/panels/InfoView';
import ShareSnapshot from './sidebar/panels/ShareSnapshot';
import { DATASET_INCLUDE_OPTIONS, GOOGLE_CLOUD_RESOURCE } from '../../../constants';

const QUERY_LIMIT = 1000;

function DatasetQueryView({
  dataset,
  dispatch,
  filterData,
  filterStatement,
  joinStatement,
  match,
  orderBy,
  profile,
  queryParams,
}) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [canLink, setCanLink] = useState(false);
  const [datasetLoaded, setDatasetLoaded] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    const datasetId = match.params.uuid;

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
    dispatch(getDatasetPolicy(datasetId));
    dispatch(getUserDatasetRoles(datasetId));
  }, [dispatch, match.params.uuid]);

  useEffect(() => {
    const datasetId = match.params.uuid;
    const loaded = dataset && dataset.schema && dataset.id === datasetId;
    if (loaded) {
      const names = dataset.schema.tables.map((t) => t.name);
      setTableNames(names);
      setSelected(names[0]);
      setSelectedTable(dataset.schema.tables.find((t) => t.name === names[0]));
      setDatasetLoaded(true);
    }
  }, [dataset, match]);

  useEffect(() => {
    if (datasetLoaded) {
      const currentPanels = [
        {
          icon: Info,
          width: 600,
          component: InfoView,
          selectedTable,
          dataset,
        },
        {
          icon: FilterList,
          width: 600,
          component: QueryViewSidebar,
          selectedTable,
          dataset,
        },
      ];
      if (canLink) {
        currentPanels.push({
          icon: People,
          width: 600,
          component: ShareSnapshot,
          selectedTable,
          dataset,
        });
      }
      setPanels(currentPanels);
    }
  }, [datasetLoaded, dataset, selectedTable, canLink]);

  useEffect(() => {
    if (profile.id) {
      setCanLink(true);
    }
  }, [profile]);

  useEffect(() => {
    if (datasetLoaded) {
      const fromClause = `FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${selected}\` AS ${selected}
          ${joinStatement}
          ${filterStatement}`;

      dispatch(
        runQuery(
          dataset.dataProject,
          `#standardSQL
          SELECT datarepo_row_id,
            ${selectedTable.columns.map((column) => column.name).join(', ')} ${fromClause}
          ${orderBy}
          LIMIT ${QUERY_LIMIT}`,
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
  }, [
    datasetLoaded,
    dataset,
    dispatch,
    filterStatement,
    joinStatement,
    orderBy,
    selected,
    selectedTable,
  ]);

  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChange = (value) => {
    setSelected(value);
    setSelectedTable(dataset.schema.tables.find((t) => t.name === value));
    dispatch(applyFilters(filterData, value, dataset));
  };

  const updateDataOnChange = () => {
    const bqStorage = dataset.storage.find(
      (s) => s.cloudResource === GOOGLE_CLOUD_RESOURCE.BIGQUERY,
    );
    const location = bqStorage?.region;

    dispatch(pageQuery(queryParams.pageToken, queryParams.projectId, queryParams.jobId, location));
  };

  if (!datasetLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <QueryView
      allowSort={true}
      resourceLoaded={datasetLoaded}
      resourceName={dataset.name}
      tableNames={tableNames}
      handleChange={handleChange}
      updateDataOnChange={updateDataOnChange}
      queryParams={queryParams}
      selected={selected}
      selectedTable={selectedTable}
      canLink={canLink}
      panels={panels}
      handleDrawerWidth={handleDrawerWidth}
      sidebarWidth={sidebarWidth}
    />
  );
}

DatasetQueryView.propTypes = {
  dataset: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  filterData: PropTypes.object,
  filterStatement: PropTypes.string.isRequired,
  joinStatement: PropTypes.string.isRequired,
  match: PropTypes.object,
  orderBy: PropTypes.string,
  profile: PropTypes.object,
  queryParams: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    filterStatement: state.query.filterStatement,
    filterData: state.query.filterData,
    joinStatement: state.query.joinStatement,
    queryParams: state.query.queryParams,
    orderBy: state.query.orderBy,
    profile: state.profiles.profile,
  };
}

export default connect(mapStateToProps)(DatasetQueryView);
