import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TdrState } from '../../../reducers';
import { BreadcrumbType, SnapshotIncludeOptions } from '../../../constants';
import { useOnMount } from '../../../libs/utils';
import {
  getDuosDatasets,
  getSnapshotById,
  getSnapshotPolicy,
  getUserSnapshotRoles,
} from '../../../actions';
import { PolicyModel, SnapshotModel } from '../../../generated/tdr';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import SnapshotOverviewPanel from './SnapshotOverviewPanel';
import SnapshotRelationshipsPanel from '../../common/overview/SchemaPanel';
import LoadingSpinner from '../../common/LoadingSpinner';
import { AppDispatch } from '../../../store';
import { SnapshotPendingSave } from '../../../reducers/snapshot';
import { DuosDatasetModel } from '../../../reducers/duos';

// @ts-ignore
const PageRoot = styled(Box)(({ theme }) => ({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
}));

const ContentRoot = styled(Box)(() => ({
  height: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  flex: 1,
}));

interface RouteParams {
  uuid: string;
}

type SnapshotProps = {
  dispatch: AppDispatch;
};

type AllSnapshotProps = SnapshotProps & RouteComponentProps<RouteParams> & StateProps;

function SnapshotOverview({
  dispatch,
  duosDatasets,
  duosDatasetsLoading,
  match,
  pendingSave,
  snapshot,
  snapshotByIdLoading,
  snapshotPolicies,
  userRoles,
}: AllSnapshotProps) {
  const snapshotId = match.params.uuid;
  useOnMount(() => {
    dispatch(
      getSnapshotById({
        snapshotId,
        include: [
          SnapshotIncludeOptions.SOURCES,
          SnapshotIncludeOptions.TABLES,
          SnapshotIncludeOptions.ACCESS_INFORMATION,
          SnapshotIncludeOptions.PROFILE,
          SnapshotIncludeOptions.DATA_PROJECT,
          SnapshotIncludeOptions.DUOS,
        ],
      }),
    );
    dispatch(getSnapshotPolicy(snapshotId));
    dispatch(getUserSnapshotRoles(snapshotId));
    dispatch(getDuosDatasets());
  });

  if (snapshotByIdLoading) {
    return <LoadingSpinner />;
  }

  const renderPage = snapshotPolicies && snapshot && snapshot.tables && snapshot.id === snapshotId;
  return renderPage ? (
    <PageRoot>
      <AppBreadcrumbs
        context={{
          type: BreadcrumbType.SNAPSHOT,
          id: snapshot.id || '',
          name: snapshot.name || '',
        }}
        childBreadcrumbs={[]}
      />
      <Typography variant="h3" sx={{ marginBottom: '1rem' }}>
        {snapshot.name}
      </Typography>
      <ContentRoot>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flexGrow: 1 }}>
            <SnapshotRelationshipsPanel
              // @ts-ignore
              tables={snapshot.tables}
              resourceType="Snapshot"
              // @ts-ignore
              resourceId={snapshot.id}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '40px',
          }}
        >
          <SnapshotOverviewPanel
            // @ts-ignore
            dispatch={dispatch}
            duosDatasets={duosDatasets}
            duosDatasetsLoading={duosDatasetsLoading}
            pendingSave={pendingSave}
            snapshot={snapshot}
            userRoles={userRoles}
          />
        </Box>
      </ContentRoot>
    </PageRoot>
  ) : (
    <Box />
  );
}

type StateProps = {
  duosDatasets: Array<DuosDatasetModel>;
  duosDatasetsLoading: boolean;
  pendingSave: SnapshotPendingSave;
  snapshot: SnapshotModel;
  snapshotByIdLoading: boolean;
  snapshotPolicies: PolicyModel[];
  userRoles: Array<string>;
};

function mapStateToProps(state: TdrState) {
  return {
    duosDatasets: state.duos.datasets,
    duosDatasetsLoading: state.duos.loading,
    pendingSave: state.snapshots.pendingSave,
    snapshot: state.snapshots.snapshot,
    snapshotByIdLoading: state.snapshots.snapshotByIdLoading,
    snapshotPolicies: state.snapshots.snapshotPolicies,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(SnapshotOverview);
