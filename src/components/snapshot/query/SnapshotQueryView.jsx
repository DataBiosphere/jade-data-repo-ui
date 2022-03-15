import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  previewData,
  getSnapshotById,
  getSnapshotPolicy,
  getUserSnapshotRoles,
} from 'actions/index';

import QueryView from 'components/common/query/QueryView';
import { SNAPSHOT_INCLUDE_OPTIONS } from '../../../constants';

function SnapshotQueryView({
  dispatch,
  filterStatement,
  joinStatement,
  match,
  orderBy,
  profile,
  queryParams,
  rowsPerPage,
  snapshot,
}) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [canLink, setCanLink] = useState(false);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  const [panels, setPanels] = useState([]);

  const updateDataOnChange = (newPage, newRowsPerPage) => {
    dispatch(
      previewData(
        snapshot.id,
        newPage * newRowsPerPage,
        newRowsPerPage,
        selected,
        selectedTable.columns,
        selectedTable.rowCount,
        newPage,
      ),
    );
  };

  useEffect(() => {
    const snapshotId = match.params.uuid;

    if (snapshot.id !== snapshotId) {
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
  }, [match, dispatch]);

  useEffect(() => {
    if (profile.id) {
      setCanLink(true);
    }
  }, [profile]);

  useEffect(() => {
    if (snapshotLoaded) {
      updateDataOnChange(0, rowsPerPage);
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
    setSnapshotLoaded(loaded);
    if (loaded) {
      const names = snapshot.tables.map((t) => t.name);
      setTableNames(names);
      setSelected(names[0]);
      setSelectedTable(snapshot.tables.find((t) => t.name === names[0]));
      // populate policy and roles for panels
      dispatch(getSnapshotPolicy(snapshot.id));
      dispatch(getUserSnapshotRoles(snapshot.id));
      setSnapshotLoaded(true);

      const currentPanels = [
        // TODO - add in next PR
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

  const handleDrawerWidth = (width) => {
    setSidebarWidth(width);
  };

  const handleChange = (value) => {
    setSelected(value);
    setSelectedTable(snapshot.tables.find((t) => t.name === value));
    updateDataOnChange(0, rowsPerPage);
  };

  if (!snapshotLoaded) {
    return <div>Loading</div>;
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
      canLink={canLink}
      panels={panels}
      handleDrawerWidth={handleDrawerWidth}
      sidebarWidth={sidebarWidth}
    />
  );
}

SnapshotQueryView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filterStatement: PropTypes.string.isRequired,
  joinStatement: PropTypes.string.isRequired,
  match: PropTypes.object,
  orderBy: PropTypes.string,
  profile: PropTypes.object,
  queryParams: PropTypes.object,
  rowsPerPage: PropTypes.number.isRequired,
  snapshot: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    filterStatement: state.query.filterStatement,
    joinStatement: state.query.joinStatement,
    orderBy: state.query.orderBy,
    profile: state.profiles.profile,
    queryParams: state.query.queryParams,
    rowsPerPage: state.query.rowsPerPage,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(SnapshotQueryView);
