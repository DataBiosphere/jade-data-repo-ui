import React from 'react';
import { ClassNameMap, withStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { CustomTheme } from '@mui/material/styles';

import { DatasetSummaryModel } from 'generated/tdr';
import { OrderDirectionOptions, TableColumnType } from 'reducers/query';

import { renderCloudPlatforms } from '../../libs/render-utils';
import LightTable from './LightTable';

const styles = (theme: CustomTheme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

type DatasetTableProps = {
  classes: ClassNameMap;
  datasets: Array<DatasetSummaryModel>;
  datasetsCount: number;
  filteredDatasetsCount: number;
  handleFilterDatasets?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
  ) => void;
  loading: boolean;
  searchString: string;
};

function DatasetTable({
  classes,
  datasets,
  datasetsCount,
  filteredDatasetsCount,
  handleFilterDatasets,
  loading,
  searchString,
}: DatasetTableProps) {
  // TODO add back modified_date column
  const columns: Array<TableColumnType> = [
    {
      label: 'Dataset Name',
      name: 'name',
      allowSort: true,
      render: (row: DatasetSummaryModel) => (
        <div>
          <Link to={`/datasets/${row.id}`}>
            <span className={classes.jadeLink}>{row.name}</span>
          </Link>
        </div>
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
      render: (row: DatasetSummaryModel) => moment(row.createdDate).fromNow(),
      width: '10%',
    },
    {
      label: 'Storage Regions',
      name: 'storage',
      allowSort: false,
      render: (row: DatasetSummaryModel) =>
        Array.from(new Set(row.storage?.map((s) => s.region))).join(', '),
      width: '15%',
    },
    {
      label: 'Cloud Platform',
      name: 'platform',
      allowSort: false,
      render: renderCloudPlatforms,
      width: '15%',
    },
  ];
  return (
    <LightTable
      columns={columns}
      handleEnumeration={handleFilterDatasets}
      noRowsMessage={
        filteredDatasetsCount < datasetsCount
          ? 'No datasets match your filter'
          : 'No datasets have been created yet'
      }
      rows={datasets}
      totalCount={datasetsCount}
      filteredCount={filteredDatasetsCount}
      searchString={searchString}
      loading={loading}
    />
  );
}

export default withStyles(styles)(DatasetTable);
