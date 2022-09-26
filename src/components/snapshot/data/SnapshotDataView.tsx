import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { resetQuery, previewData, getSnapshotById } from 'actions/index';
import DataView from 'components/common/data/DataView';
import { Action, Dispatch } from 'redux';
import { RouteComponentProps } from 'react-router-dom';
import { SnapshotModel, TableModel } from 'generated/tdr';
import { OrderDirectionOptions } from 'reducers/query';
import { TdrState } from 'reducers';

import { ResourceType, SnapshotIncludeOptions } from '../../../constants';

type IProps = {
  dispatch: Dispatch<Action>;
  polling: boolean;
  snapshot: SnapshotModel;
} & RouteComponentProps<{ uuid?: string }>;

function SnapshotDataView({ dispatch, match, polling, snapshot }: IProps) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState<TableModel | undefined>(undefined);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [snapshotLoaded, setSnapshotLoaded] = useState(false);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [panels, setPanels] = useState<object[]>([]);

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
      const names = snapshot.tables?.map((t) => t.name) || [];
      setTableNames(names);
      setSelected(names[0]);
      setSelectedTable(snapshot.tables?.find((t) => t.name === names[0]));
      setSnapshotLoaded(true);

      const currentPanels: object[] = [
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
  const handleDrawerWidth = (width: number) => {
    setSidebarWidth(width);
  };

  const handleChangeTable = (value: string) => {
    dispatch(resetQuery());
    setSelected(value);
    setSelectedTable(snapshot.tables?.find((t) => t.name === value));
  };

  const handleEnumeration = (
    _limit: number,
    _offset: number,
    sort: string,
    sortDirection: OrderDirectionOptions,
    _searchString: string,
    _refreshCnt: number,
  ) => {
    const snapshotId = match.params.uuid;
    if (snapshotLoaded && snapshotId === snapshot.id && !polling) {
      dispatch(
        previewData(
          ResourceType.SNAPSHOT,
          snapshot.id,
          selected,
          selectedTable?.columns,
          selectedTable?.rowCount,
          sortDirection,
          sort,
        ),
      );
    }
  };

  if (!snapshotLoaded || !snapshot || !selectedTable) {
    return <LoadingSpinner />;
  }

  return (
    <DataView
      resourceId={snapshot.id || ''}
      resourceLoaded={snapshotLoaded}
      resourceName={snapshot.name || ''}
      resourceType={ResourceType.SNAPSHOT}
      tableNames={tableNames}
      handleChangeTable={handleChangeTable}
      handleEnumeration={handleEnumeration}
      selected={selected}
      selectedTable={selectedTable}
      canLink={false}
      panels={panels}
      handleDrawerWidth={handleDrawerWidth}
      sidebarWidth={sidebarWidth}
    />
  );
}

function mapStateToProps(state: TdrState) {
  return {
    page: state.query.page,
    polling: state.query.polling,
    profile: state.profiles.profile,
    queryParams: state.query.queryParams,
    rowsPerPage: state.query.rowsPerPage,
    snapshot: state.snapshots.snapshot,
  };
}

export default connect(mapStateToProps)(SnapshotDataView);
