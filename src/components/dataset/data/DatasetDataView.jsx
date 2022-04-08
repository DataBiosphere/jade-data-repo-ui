import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  resetQuery,
  runQuery,
  getDatasetById,
  getDatasetPolicy,
  countResults,
  getUserDatasetRoles,
  pageQuery,
} from 'actions/index';
import { FilterList, Info, People } from '@mui/icons-material';

import DataView from 'components/common/data/DataView';
import LoadingSpinner from 'components/common/LoadingSpinner';
import DataViewSidebar from './sidebar/DataViewSidebar';
import InfoView from './sidebar/panels/InfoView';
import ShareSnapshot from './sidebar/panels/ShareSnapshot';
import {
  DbColumns,
  DatasetIncludeOptions,
  GoogleCloudResource,
  ResourceType,
} from '../../../constants';

const QUERY_LIMIT = 1000;

function DatasetDataView({
  dataset,
  dispatch,
  filterStatement,
  joinStatement,
  match,
  orderDirection,
  orderProperty,
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
          DatasetIncludeOptions.SCHEMA,
          DatasetIncludeOptions.ACCESS_INFORMATION,
          DatasetIncludeOptions.PROFILE,
          DatasetIncludeOptions.DATA_PROJECT,
          DatasetIncludeOptions.STORAGE,
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
          component: DataViewSidebar,
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
          SELECT ${DbColumns.ROW_ID},
            ${selectedTable.columns.map((column) => column.name).join(', ')} ${fromClause}
            ${orderProperty ? `ORDER BY ${orderProperty} ${orderDirection}` : ''}
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
    orderDirection,
    orderProperty,
    selected,
    selectedTable,
  ]);

  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChangeTable = (value) => {
    dispatch(resetQuery());
    setSelected(value);
    setSelectedTable(dataset.schema.tables.find((t) => t.name === value));
  };

  const pageBQQuery = () => {
    const bqStorage = dataset.storage.find((s) => s.cloudResource === GoogleCloudResource.BIGQUERY);
    const location = bqStorage?.region;

    dispatch(pageQuery(queryParams.pageToken, queryParams.projectId, queryParams.jobId, location));
  };

  if (!datasetLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <DataView
      resourceId={dataset.id}
      resourceLoaded={datasetLoaded}
      resourceName={dataset.name}
      resourceType={ResourceType.DATASET}
      tableNames={tableNames}
      handleChangeTable={handleChangeTable}
      pageBQQuery={pageBQQuery}
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

DatasetDataView.propTypes = {
  dataset: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  filterStatement: PropTypes.string.isRequired,
  joinStatement: PropTypes.string.isRequired,
  match: PropTypes.object,
  orderDirection: PropTypes.string,
  orderProperty: PropTypes.string,
  profile: PropTypes.object,
  queryParams: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    filterStatement: state.query.filterStatement,
    joinStatement: state.query.joinStatement,
    queryParams: state.query.queryParams,
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
    profile: state.profiles.profile,
  };
}

export default connect(mapStateToProps)(DatasetDataView);
