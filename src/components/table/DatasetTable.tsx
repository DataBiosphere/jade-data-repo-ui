import React from 'react';
import moment from 'moment';
import { DatasetSummaryModel } from 'generated/tdr';
import { OrderDirectionOptions, TableColumnType } from 'reducers/query';

import TextContent from 'components/common/TextContent';
import { styled } from '@mui/system';
import { CustomTheme } from '@mui/material/styles';
import { renderCloudPlatforms } from '../../libs/render-utils';
import LightTable from './LightTable';
import ResourceName from './ResourceName';
import { ResourceType } from '../../constants';

const TextWrapper = styled('span')(({ theme }) => ({
  ...(theme as CustomTheme).mixins.ellipsis,
}));

interface IProps {
  readonly datasets: Array<DatasetSummaryModel>;
  readonly datasetRoleMaps: { [key: string]: Array<string> };
  readonly datasetsCount: number;
  readonly filteredDatasetsCount: number;
  readonly handleFilterDatasets?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  readonly handleMakeSteward?: (datasetId: string) => void;
  readonly loading: boolean;
  readonly searchString: string;
  readonly refreshCnt: number;
}

function DatasetTable({
  datasets,
  datasetRoleMaps,
  datasetsCount,
  filteredDatasetsCount,
  handleFilterDatasets,
  handleMakeSteward,
  loading,
  searchString,
  refreshCnt,
}: IProps) {
  // TODO add back modified_date column
  const columns: Array<TableColumnType> = [
    {
      label: 'Dataset Name',
      name: 'name',
      allowSort: true,
      render: (row: DatasetSummaryModel) => (
        <ResourceName
          resourceType={ResourceType.DATASET}
          resource={row}
          roleMaps={datasetRoleMaps}
          handleMakeSteward={handleMakeSteward}
        />
      ),
      width: '25%',
    },
    {
      label: 'Description',
      name: 'description',
      allowSort: true,
      render: (row: DatasetSummaryModel) => (
        <TextContent text={row.description} stripMarkdown markdown={true} />
      ),
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
      render: (row: DatasetSummaryModel) => <TextWrapper>{renderCloudPlatforms(row)}</TextWrapper>,
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
      refreshCnt={refreshCnt}
    />
  );
}

export default DatasetTable;
