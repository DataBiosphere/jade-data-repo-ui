import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { ClassNameMap, createStyles, withStyles } from '@mui/styles';
import { getDatasetById, getDatasetPolicy, getUserDatasetRoles } from 'actions';
import { Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { DatasetModel, DatasetRequestModelPolicies } from 'generated/tdr';
import { Action } from 'redux';
import { TdrState } from 'reducers';
import { RouteComponentProps } from 'react-router-dom';
import DatasetRelationshipsPanel from '../../common/overview/SchemaPanel';
import { useOnMount } from '../../../libs/utils';
import { BreadcrumbType, DatasetIncludeOptions } from '../../../constants';
import LoadingSpinner from '../../common/LoadingSpinner';
import DatasetOverviewPanel from './DatasetOverviewPanel';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';

const styles = (theme: CustomTheme) =>
  createStyles({
    pageRoot: { ...theme.mixins.pageRoot },
    pageTitle: { ...theme.mixins.pageTitle },
    root: {
      // TODO: expect this to change as more components are added
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      flex: 1,
    },
    headerText: {
      textTransform: 'uppercase',
      marginBottom: '0.5rem',
    },
    infoColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    infoColumnPanel: {
      flexGrow: 1,
    },
    mainColumn: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 40,
    },
    snapshotsArea: {
      flexGrow: 1,
      marginTop: '1.5rem',
    },
    spacer: {
      height: '4rem',
    },
    snapshotCardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 32%))',
      gridGap: '1rem',
    },
  });

interface DatasetOverviewProps extends RouteComponentProps<{ uuid?: string }> {
  classes: ClassNameMap;
  dataset: DatasetModel;
  datasetPolicies: DatasetRequestModelPolicies;
  datasetByIdLoading: boolean;
  dispatch: Dispatch<Action>;
}

type Context = { type: BreadcrumbType; id: string; name: string };

function DatasetOverview({
  classes,
  dataset,
  datasetPolicies,
  datasetByIdLoading,
  dispatch,
  match,
}: DatasetOverviewProps) {
  const datasetId = match.params.uuid;
  useOnMount(() => {
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
  });

  if (datasetByIdLoading) {
    return <LoadingSpinner />;
  }
  return datasetPolicies && dataset && dataset.schema && dataset.id === datasetId ? (
    <div className={classes.pageRoot}>
      <AppBreadcrumbs
        context={{ type: BreadcrumbType.DATASET, id: datasetId, name: dataset.name } as Context}
        childBreadcrumbs={[]}
      />
      <Typography variant="h3" className={classes.pageTitle}>
        {dataset.name}
      </Typography>
      <div className={classes.root}>
        <div className={classes.infoColumn}>
          <div className={classes.infoColumnPanel}>
            <DatasetRelationshipsPanel
              tables={dataset.schema.tables}
              resourceType="Dataset"
              resourceId={dataset.id}
            />
          </div>
        </div>
        <div className={classes.mainColumn}>
          <DatasetOverviewPanel dataset={dataset} />
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}
function mapStateToProps(state: TdrState) {
  return {
    dataset: state.datasets.dataset,
    datasetPolicies: state.datasets.datasetPolicies,
    datasetByIdLoading: state.datasets.datasetByIdLoading,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(DatasetOverview));
