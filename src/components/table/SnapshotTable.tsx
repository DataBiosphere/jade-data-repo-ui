import React from 'react';
import moment from 'moment';
import { WithStyles, withStyles } from '@mui/styles';
import { OrderDirectionOptions } from 'reducers/query';
import { DatasetSummaryModel, SnapshotSummaryModel } from 'generated/tdr/api';
import { CustomTheme } from '@mui/material/styles';

import LightTable from './LightTable';
import { renderCloudPlatforms } from '../../libs/render-utils';
import { ResourceType } from '../../constants';
import ResourceName from './ResourceName';

const styles = (theme: CustomTheme) => ({
  textWrapper: {
    ...theme.mixins.ellipsis,
  },
});

interface IProps extends WithStyles<typeof styles> {
  snapshots: Array<SnapshotSummaryModel>;
  snapshotRoleMaps: { [key: string]: Array<string> };
  snapshotCount: number;
  filteredSnapshotCount: number;
  handleFilterSnapshots?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  handleMakeSteward?: (snapshotId: string) => void;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
}

const SnapshotTable = withStyles(styles)(
  ({
    classes,
    snapshots,
    snapshotRoleMaps,
    snapshotCount,
    filteredSnapshotCount,
    handleFilterSnapshots,
    handleMakeSteward,
    loading,
    searchString,
    refreshCnt,
  }: IProps) => {
    const columns = [
      {
        label: 'Snapshot Name',
        name: 'name',
        allowSort: true,
        render: (row: SnapshotSummaryModel) => (
          <ResourceName
            resourceType={ResourceType.SNAPSHOT}
            resource={row}
            roleMaps={snapshotRoleMaps}
            handleMakeSteward={handleMakeSteward}
          />
        ),
        width: '25%',
      },
      {
        label: 'Description',
        name: 'description',
        allowSort: true,
        width: '35%',
      },
      {
        label: 'Date created',
        name: 'created_date',
        allowSort: true,
        render: (row: SnapshotSummaryModel) => moment(row.createdDate).fromNow(),
        width: '10%',
      },
      {
        label: 'Storage Regions',
        name: 'storage',
        allowSort: false,
        render: (row: SnapshotSummaryModel) =>
          Array.from(new Set(row.storage?.map((s) => s.region))).join(', '),
        width: '15%',
      },
      {
        label: 'Cloud Platform',
        name: 'platform',
        allowSort: false,
        render: (row: DatasetSummaryModel) => (
          <span className={classes.textWrapper}>{renderCloudPlatforms(row)}</span>
        ),
        width: '15%',
      },
    ];
    return (
      <div>
        <LightTable
          columns={columns}
          handleEnumeration={handleFilterSnapshots}
          noRowsMessage={
            filteredSnapshotCount < snapshotCount
              ? 'No snapshots match your filter'
              : 'No snapshots have been created yet'
          }
          rows={snapshots}
          totalCount={snapshotCount}
          filteredCount={filteredSnapshotCount}
          searchString={searchString}
          loading={loading}
          refreshCnt={refreshCnt}
        />
      </div>
    );
  },
);

export default SnapshotTable;
