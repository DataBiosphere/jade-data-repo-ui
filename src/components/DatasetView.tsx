import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { Box, Typography } from '@mui/material';
import { getDatasets, addDatasetPolicyMember } from 'actions/index';
import { DatasetSummaryModel } from 'generated/tdr';
import { TdrState } from 'reducers';
import { OrderDirectionOptions } from 'reducers/query';
import { styled } from '@mui/system';
import theme from 'modules/theme';
import DatasetTable from './table/DatasetTable';
import { DatasetRoles } from '../constants';

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '54px',
  lineHeight: '66px',
  paddingBottom: theme.spacing(8),
}));

interface IProps {
  datasets: Array<DatasetSummaryModel>;
  datasetRoleMaps: { [key: string]: Array<string> };
  datasetsCount: number;
  dispatch: Dispatch<Action>;
  filteredDatasetsCount: number;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
  userEmail: string;
}

function DatasetView({
  datasets,
  datasetRoleMaps,
  datasetsCount,
  dispatch,
  filteredDatasetsCount,
  loading,
  searchString,
  refreshCnt,
  userEmail,
}: IProps) {
  const handleFilterDatasets = (
    limit: number,
    offset: number,
    sort: string,
    sortDirection: OrderDirectionOptions,
    search: string,
  ) => {
    dispatch(getDatasets(limit, offset, sort, sortDirection, search));
  };

  const handleMakeSteward = (datasetId: string) => {
    dispatch(addDatasetPolicyMember(datasetId, userEmail, DatasetRoles.STEWARD));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1em' }}>
      <Box sx={{ ...theme.mixins.containerWidth }}>
        <Title>Datasets</Title>
        {datasets && (
          <DatasetTable
            datasets={datasets}
            datasetRoleMaps={datasetRoleMaps}
            datasetsCount={datasetsCount}
            handleFilterDatasets={handleFilterDatasets}
            handleMakeSteward={handleMakeSteward}
            filteredDatasetsCount={filteredDatasetsCount}
            searchString={searchString}
            loading={loading}
            refreshCnt={refreshCnt}
          />
        )}
      </Box>
    </Box>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    datasets: state.datasets.datasets,
    datasetRoleMaps: state.datasets.datasetRoleMaps,
    datasetsCount: state.datasets.datasetsCount,
    filteredDatasetsCount: state.datasets.filteredDatasetsCount,
    features: state.user.features,
    loading: state.datasets.loading,
    userEmail: state.user.email,
    refreshCnt: state.datasets.refreshCnt,
  };
}

export default connect(mapStateToProps)(DatasetView);
