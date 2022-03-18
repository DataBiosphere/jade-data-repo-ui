import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { previewData, getSnapshotById } from 'actions/index';

import QueryView from 'components/common/query/QueryView';
import { SNAPSHOT_INCLUDE_OPTIONS } from '../../../constants';

function SnapshotQueryView({ dispatch, match, queryParams, snapshot }) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [panels, setPanels] = useState([]);

  const updateDataOnChange = useCallback(() => {
    dispatch(previewData(snapshot.id, selected, selectedTable.columns, selectedTable.rowCount));
  }, [dispatch, snapshot.id, selected, selectedTable]);

  useEffect(() => {
    const snapshotId = match.params.uuid;

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
  }, [dispatch, match.params.uuid]);

  useEffect(() => {
    const snapshotId = match.params.uuid;
    if (snapshotLoaded && snapshotId === snapshot.id) {
      updateDataOnChange();
    }
  }, [snapshotLoaded, snapshot, dispatch, match, selected, selectedTable, updateDataOnChange]);

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
        // TODO - add in w/ panel PR
        // {
        //   icon: Info,
        //   width: 600,
        //   component: InfoView,
        //   selectedTable,
        //   snapshot,
        // },
      ];
      setPanels(currentPanels);
    }
  }, [snapshot, match]);

  // TODO - this doesn't do anything until we add panels
  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChange = (value) => {
    setSelected(value);
    setSelectedTable(snapshot.tables.find((t) => t.name === value));
  };

  if (!snapshotLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <QueryView
      allowSort={false}
      resourceLoaded={snapshotLoaded}
      resourceName={snapshot.name}
      tableNames={tableNames}
      handleChange={handleChange}
      updateDataOnChange={updateDataOnChange}
      queryParams={queryParams}
      selected={selected}
      selectedTable={selectedTable}
      canLink={false}
      panels={panels}
      handleDrawerWidth={handleDrawerWidth}
      sidebarWidth={sidebarWidth}
    />
  );
}

SnapshotQueryView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
  queryParams: PropTypes.object,
  snapshot: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    profile: state.profiles.profile,
    queryParams: state.query.queryParams,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(SnapshotQueryView);
