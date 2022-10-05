import React from 'react';
import { WithStyles, withStyles } from '@mui/styles';
import moment from 'moment';
import { DatasetSummaryModel } from 'generated/tdr';
import { OrderDirectionOptions, TableColumnType } from 'reducers/query';
import { CustomTheme } from '@mui/material/styles';

import { renderCloudPlatforms } from '../../libs/render-utils';
import LightTable from './LightTable';
import ResourceName from './ResourceName';
import { ResourceType } from '../../constants';
import MarkdownContent from 'components/common/MarkdownContent';

const styles = (theme: CustomTheme) => ({
  textWrapper: {
    ...theme.mixins.ellipsis,
  },
});

interface IProps extends WithStyles<typeof styles> {
  datasets: Array<DatasetSummaryModel>;
  datasetRoleMaps: { [key: string]: Array<string> };
  datasetsCount: number;
  filteredDatasetsCount: number;
  handleFilterDatasets?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  handleMakeSteward?: (datasetId: string) => void;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
}

const DatasetTable = withStyles(styles)(
  ({
    classes,
    datasets,
    datasetRoleMaps,
    datasetsCount,
    filteredDatasetsCount,
    handleFilterDatasets,
    handleMakeSteward,
    loading,
    searchString,
    refreshCnt,
  }: IProps) => {
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
          <MarkdownContent markdownText={row.description} stripMarkdown />
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
        render: (row: DatasetSummaryModel) => (
          <span className={classes.textWrapper}>{renderCloudPlatforms(row)}</span>
        ),
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
  },
);

export default DatasetTable;
