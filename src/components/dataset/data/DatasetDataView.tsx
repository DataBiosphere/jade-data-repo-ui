import React, { useState, useEffect, Dispatch } from 'react';
import { connect } from 'react-redux';

import {
  resetQuery,
  getDatasetById,
  getDatasetPolicy,
  getUserDatasetRoles,
  previewData,
} from 'actions/index';
import { FilterList, Info, People } from '@mui/icons-material';
import DataView from 'components/common/data/DataView';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { BillingProfileModel, DatasetModel, TableModel } from 'generated/tdr';
import { Action } from 'redux';
import { OrderDirectionOptions } from 'reducers/query';
import { RouteComponentProps } from 'react-router-dom';
import { TdrState } from 'reducers';
import { SnapshotRequest } from 'reducers/snapshot';

import DataViewSidebar from './sidebar/DataViewSidebar';
import InfoView from './sidebar/panels/InfoView';
import ShareSnapshot from './sidebar/panels/ShareSnapshot';
import {
  DatasetIncludeOptions,
  ResourceType,
} from '../../../constants';

type IProps = {
  dataset: DatasetModel;
  dispatch: Dispatch<Action>;
  filterStatement: string;
  joinStatement: string;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
  polling: boolean;
  profile: BillingProfileModel;
  snapshotRequest: SnapshotRequest;
} & RouteComponentProps<{ uuid?: string }>;

function DatasetDataView({
  dataset,
  dispatch,
  match,
  polling,
  profile,
  snapshotRequest,
}: IProps) {
  const [selected, setSelected] = useState('');
  const [selectedTable, setSelectedTable] = useState<TableModel | undefined>(undefined);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [canLink, setCanLink] = useState(false);
  const [datasetLoaded, setDatasetLoaded] = useState(false);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [panels, setPanels] = useState<object[]>([]);

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
      const names = dataset.schema?.tables.map((t) => t.name) || [];
      setTableNames(names);
      setSelected(names[0]);
      setSelectedTable(dataset.schema?.tables.find((t) => t.name === names[0]));
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
      if (canLink && snapshotRequest.assetName) {
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
  }, [datasetLoaded, dataset, selectedTable, canLink, snapshotRequest.assetName]);

  useEffect(() => {
    if (profile.id) {
      setCanLink(true);
    }
  }, [profile]);

  const handleEnumeration = (
    _limit: number,
    _offset: number,
    sort: string,
    sortDirection: OrderDirectionOptions,
    _searchString: string,
    _refreshCnt: number,
  ) => {
    const datasetId = match.params.uuid;
    if (datasetLoaded && datasetId === dataset.id && !polling) {
      dispatch(
        previewData(
          ResourceType.DATASET,
          dataset.id,
          selected,
          selectedTable?.columns,
          selectedTable?.rowCount,
          sortDirection,
          sort,
        ),
      );
    }
  };

  const handleDrawerWidth = (width: number) => {
    setSidebarWidth(width);
  };

  const handleChangeTable = (value: string) => {
    dispatch(resetQuery());
    setSelected(value);
    setSelectedTable(dataset.schema?.tables?.find((t) => t.name === value));
  };

  if (!datasetLoaded || !dataset || !selectedTable) {
    return <LoadingSpinner />;
  }

  return (
    <DataView
      resourceId={dataset.id || ''}
      resourceLoaded={datasetLoaded}
      resourceName={dataset.name || ''}
      resourceType={ResourceType.DATASET}
      tableNames={tableNames}
      handleEnumeration={handleEnumeration}
      handleChangeTable={handleChangeTable}
      selected={selected}
      selectedTable={selectedTable}
      canLink={canLink}
      panels={panels}
      handleDrawerWidth={handleDrawerWidth}
      sidebarWidth={sidebarWidth}
    />
  );
}

function mapStateToProps(state: TdrState) {
  return {
    dataset: state.datasets.dataset,
    filterStatement: state.query.filterStatement,
    joinStatement: state.query.joinStatement,
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
    page: state.query.page,
    polling: state.query.polling,
    profile: state.profiles.profile,
    rowsPerPage: state.query.rowsPerPage,
    snapshotRequest: state.snapshots.snapshotRequest,
  };
}

export default connect(mapStateToProps)(DatasetDataView);
