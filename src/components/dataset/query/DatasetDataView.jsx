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
} from 'actions/index';
import { FilterList, Info, People } from '@material-ui/icons';

import QueryView from 'components/common/query/QueryView';
import QueryViewSidebar from '../../common/query/sidebar/QueryViewSidebar';
import InfoView from '../../common/query/sidebar/panels/InfoView';
import ShareSnapshot from '../../common/query/sidebar/panels/ShareSnapshot';
import { DATASET_INCLUDE_OPTIONS } from '../../../constants';

const PAGE_SIZE = 100;
const QUERY_LIMIT = 1000;

function DatasetQueryView({
  dataset,
  datasetPolicies,
  dispatch,
  filterData,
  filterStatement,
  joinStatement,
  match,
  orderBy,
  profile,
  queryResults,
  userRole,
}) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [canLink, setCanLink] = useState(false);
  const [hasDataset, setHasDataset] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [panels, setPanels] = useState([]);

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
    if (profile.id) {
      setCanLink(true);
    }
  }, [profile]);

  useEffect(() => {
    if (hasDataset) {
      const fromClause = `FROM \`${dataset.dataProject}.datarepo_${dataset.name}.${selected}\` AS ${selected}
          ${joinStatement}
          ${filterStatement}`;

      dispatch(
        runQuery(
          dataset.dataProject,
          `#standardSQL
          SELECT datarepo_row_id, ${selectedTable.columns
            .map((column) => column.name)
            .join(', ')} ${fromClause}
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
  }, [
    hasDataset,
    dataset,
    dispatch,
    filterStatement,
    joinStatement,
    orderBy,
    selected,
    selectedTable,
  ]);

  useEffect(() => {
    const datasetId = match.params.uuid;
    const datasetLoaded = dataset && dataset.schema && dataset.id === datasetId;
    if (datasetLoaded) {
      const names = dataset.schema.tables.map((t) => t.name);
      setTableNames(names);
      setSelected(names[0]);
      setSelectedTable(dataset.schema.tables.find((t) => t.name === names[0]));
      setHasDataset(true);

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
  }, [dataset, match]);

  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChange = (value) => {
    setSelected(value);
    setSelectedTable(dataset.schema.tables.find((t) => t.name === value));
    dispatch(applyFilters(filterData, value, dataset, dataset.schema.relationships));
  };

  if (!hasDataset) {
    return <div>Loading</div>;
  }

  return (
    <QueryView
      resourceLoaded={hasDataset}
      resourceName={dataset.name}
      tableNames={tableNames}
      handleChange={handleChange}
      queryResults={queryResults}
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
  datasetPolicies: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  filterData: PropTypes.object,
  filterStatement: PropTypes.string.isRequired,
  joinStatement: PropTypes.string.isRequired,
  match: PropTypes.object,
  orderBy: PropTypes.string,
  profile: PropTypes.object,
  queryResults: PropTypes.object,
  userRole: PropTypes.array,
};

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

export default connect(mapStateToProps)(DatasetQueryView);
