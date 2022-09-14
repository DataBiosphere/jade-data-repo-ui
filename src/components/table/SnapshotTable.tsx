import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { ClassNameMap, withStyles } from '@mui/styles';
import { OrderDirectionOptions } from 'reducers/query';
import { CustomTheme } from '@mui/material/styles';
import { SnapshotSummaryModel } from 'generated/tdr/api';

import LightTable from './LightTable';
import { renderCloudPlatforms } from '../../libs/render-utils';

const styles = (theme: CustomTheme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

type SnapshotTableProps = {
  classes: ClassNameMap;
  snapshots: Array<SnapshotSummaryModel>;
  snapshotCount: number;
  filteredSnapshotCount: number;
  handleFilterSnapshots?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
  ) => void;
  loading: boolean;
  searchString: string;
};

function SnapshotTable({
  classes,
  snapshots,
  snapshotCount,
  filteredSnapshotCount,
  handleFilterSnapshots,
  loading,
  searchString,
}: SnapshotTableProps) {
  const columns = [
    {
      label: 'Snapshot Name',
      name: 'name',
      allowSort: true,
      render: (row: SnapshotSummaryModel) => (
        <Link to={`/snapshots/${row.id}`}>
          <span className={classes.jadeLink}>{row.name}</span>
        </Link>
      ),
    },
    {
      label: 'Description',
      name: 'description',
      allowSort: true,
    },
    {
      label: 'Date created',
      name: 'created_date',
      allowSort: true,
      render: (row: SnapshotSummaryModel) => moment(row.createdDate).fromNow(),
    },
    {
      label: 'Storage Regions',
      name: 'storage',
      allowSort: false,
      render: (row: SnapshotSummaryModel) =>
        Array.from(new Set(row.storage?.map((s) => s.region))).join(', '),
    },
    {
      label: 'Cloud Platform',
      name: 'platform',
      allowSort: false,
      render: renderCloudPlatforms,
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
      />
    </div>
  );
}

export default withStyles(styles)(SnapshotTable);
