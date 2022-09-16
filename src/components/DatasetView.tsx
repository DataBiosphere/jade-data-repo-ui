import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { WithStyles, withStyles } from '@mui/styles';
import { getDatasets, addDatasetPolicyMember } from 'actions/index';
import { DatasetSummaryModel } from 'generated/tdr';
import { CustomTheme } from '@mui/material';
import { TdrState } from 'reducers';
import { OrderDirectionOptions } from 'reducers/query';
import DatasetTable from './table/DatasetTable';

import { DatasetRoles } from '../constants';

const styles = (theme: CustomTheme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1em',
  },
  width: {
    ...theme.mixins.containerWidth,
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '54px',
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
});

interface IProps extends WithStyles<typeof styles> {
  datasets: Array<DatasetSummaryModel>;
  datasetRoleMaps: { [key: string]: Array<string> };
  datasetsCount: number;
  dispatch: Dispatch<Action>;
  filteredDatasetsCount: number;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
  user: string;
}

const DatasetView = withStyles(styles)(
  ({
    classes,
    datasets,
    datasetRoleMaps,
    datasetsCount,
    dispatch,
    filteredDatasetsCount,
    loading,
    searchString,
    refreshCnt,
    user,
  }: IProps) => {
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
      dispatch(addDatasetPolicyMember(datasetId, user, DatasetRoles.STEWARD));
    };

    return (
      <div className={classes.wrapper}>
        <div className={classes.width}>
          <div>
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
          </div>
        </div>
      </div>
    );
  },
);

function mapStateToProps(state: TdrState) {
  return {
    datasets: state.datasets.datasets,
    datasetRoleMaps: state.datasets.datasetRoleMaps,
    datasetsCount: state.datasets.datasetsCount,
    filteredDatasetsCount: state.datasets.filteredDatasetsCount,
    features: state.user.features,
    loading: state.datasets.loading,
    user: state.user.email,
    refreshCnt: state.datasets.refreshCnt,
  };
}

export default connect(mapStateToProps)(DatasetView);
