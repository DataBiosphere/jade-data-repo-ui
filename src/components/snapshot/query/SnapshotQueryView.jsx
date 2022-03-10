import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  applyFilters,
  runQuery,
  getSnapshotById,
  getSnapshotPolicy,
  countResults,
  getUserSnapshotRoles,
} from 'actions/index';
import { Info } from '@material-ui/icons';

import QueryView from 'components/common/query/QueryView';
import InfoView from '../../common/query/sidebar/panels/InfoView';
import { SNAPSHOT_INCLUDE_OPTIONS } from '../../../constants';

const PAGE_SIZE = 100;
const QUERY_LIMIT = 1000;

function SnapshotQueryView({
  snapshot,
  snapshotPolicies,
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
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    const snapshotId = match.params.uuid;

    if (snapshot == null || snapshot.id !== snapshotId) {
      dispatch(
        getSnapshotById({
          snapshotId,
          include: [
            SNAPSHOT_INCLUDE_OPTIONS.SOURCES,
            SNAPSHOT_INCLUDE_OPTIONS.TABLES,
            SNAPSHOT_INCLUDE_OPTIONS.RELATIONSHIPS,
            SNAPSHOT_INCLUDE_OPTIONS.ACCESS_INFORMATION,
            SNAPSHOT_INCLUDE_OPTIONS.PROFILE,
            SNAPSHOT_INCLUDE_OPTIONS.DATA_PROJECT,
          ],
        }),
      );
    }

    if (snapshotPolicies == null || snapshot.id !== snapshotId) {
      dispatch(getSnapshotPolicy(snapshotId));
    }

    if (userRole == null || snapshot.id !== snapshotId) {
      dispatch(getUserSnapshotRoles(snapshotId));
    }
  }, [dispatch, match, snapshot, snapshotPolicies, userRole]);

  useEffect(() => {
    if (profile.id) {
      setCanLink(true);
    }
  }, [profile]);

  useEffect(() => {
    if (snapshotLoaded) {
      const fromClause = `FROM \`${snapshot.dataProject}.datarepo_${snapshot.name}.${selected}\` AS ${selected}
            ${joinStatement}
            ${filterStatement}`;

      dispatch(
        runQuery(
          snapshot.dataProject,
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
          snapshot.dataProject,
          `#standardSQL
            SELECT COUNT(1) ${fromClause}`,
        ),
      );
    }
  }, [
    snapshotLoaded,
    snapshot,
    dispatch,
    filterStatement,
    joinStatement,
    orderBy,
    selected,
    selectedTable,
  ]);

  useEffect(() => {
    const snapshotId = match.params.uuid;
    const loaded = snapshot && snapshot.tables && snapshot.id === snapshotId;
    if (loaded) {
      const names = snapshot.tables.map((t) => t.name);
      setTableNames(names);
      setSelected(names[0]);
      setSelectedTable(snapshot.tables.find((t) => t.name === names[0]));
      setSnapshotLoaded(true);

      const currentPanels = [
        {
          icon: Info,
          width: 600,
          component: InfoView,
          selectedTable,
          snapshot,
        },
      ];
      setPanels(currentPanels);
    }
  }, [snapshot, match]);

  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChange = (value) => {
    setSelected(value);
    setSelectedTable(snapshot.tables.find((t) => t.name === value));
    dispatch(applyFilters(filterData, value, snapshot, snapshot.relationships));
  };

  if (!snapshotLoaded) {
    return <div>Loading</div>;
  }

  return (
    <QueryView
      resourceLoaded={snapshotLoaded}
      resourceName={snapshot.name}
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

SnapshotQueryView.propTypes = {
  snapshot: PropTypes.object,
  snapshotPolicies: PropTypes.array,
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
    snapshot: state.snapshots.snapshot,
    snapshotPolicies: state.snapshots.snapshotPolicies,
    filterStatement: state.query.filterStatement,
    filterData: state.query.filterData,
    joinStatement: state.query.joinStatement,
    queryResults: state.query.queryResults,
    orderBy: state.query.orderBy,
    profile: state.profiles.profile,
  };
}

export default connect(mapStateToProps)(SnapshotQueryView);
