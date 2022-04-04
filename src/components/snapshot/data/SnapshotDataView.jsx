import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { resetQuery, previewData, getSnapshotById } from 'actions/index';

import DataView from 'components/common/data/DataView';
import { ResourceType, SnapshotIncludeOptions } from '../../../constants';

function SnapshotDataView({ dispatch, match, page, queryParams, rowsPerPage, snapshot }) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [panels, setPanels] = useState([]);

  useEffect(() => {
    const snapshotId = match.params.uuid;

    dispatch(
      getSnapshotById({
        snapshotId,
        include: [
          SnapshotIncludeOptions.SOURCES,
          SnapshotIncludeOptions.TABLES,
          SnapshotIncludeOptions.RELATIONSHIPS,
          SnapshotIncludeOptions.ACCESS_INFORMATION,
          SnapshotIncludeOptions.PROFILE,
          SnapshotIncludeOptions.DATA_PROJECT,
        ],
      }),
    );
  }, [dispatch, match.params.uuid]);

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

  useEffect(() => {
    const snapshotId = match.params.uuid;
    if (snapshotLoaded && snapshotId === snapshot.id) {
      dispatch(
        previewData(
          ResourceType.SNAPSHOT,
          snapshot.id,
          selected,
          selectedTable.columns,
          selectedTable.rowCount,
        ),
      );
    }
  }, [
    snapshotLoaded,
    snapshot.id,
    match.params.uuid,
    selected,
    selectedTable,
    page,
    rowsPerPage,
    dispatch,
  ]);

  // TODO - this doesn't do anything until we add panels
  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChangeTable = (value) => {
    dispatch(resetQuery());
    setSelected(value);
    setSelectedTable(snapshot.tables.find((t) => t.name === value));
  };

  if (!snapshotLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <DataView
      resourceId={snapshot.id}
      resourceLoaded={snapshotLoaded}
      resourceName={snapshot.name}
      resourceType={ResourceType.SNAPSHOT}
      tableNames={tableNames}
      handleChangeTable={handleChangeTable}
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

SnapshotDataView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
  page: PropTypes.number,
  queryParams: PropTypes.object,
  rowsPerPage: PropTypes.number,
  snapshot: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    page: state.query.page,
    profile: state.profiles.profile,
    queryParams: state.query.queryParams,
    rowsPerPage: state.query.rowsPerPage,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(SnapshotDataView);
