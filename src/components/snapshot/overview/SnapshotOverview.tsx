import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Typography } from '@mui/material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { TdrState } from '../../../reducers';
import { BreadcrumbType, SnapshotIncludeOptions } from '../../../constants';
import { useOnMount } from '../../../libs/utils';
import { getSnapshotById, getSnapshotPolicy, getUserSnapshotRoles } from '../../../actions';
import { PolicyModel, SnapshotModel } from '../../../generated/tdr';
import AppBreadcrumbs from '../../AppBreadcrumbs/AppBreadcrumbs';
import SnapshotOverviewPanel from './SnapshotOverviewPanel';
import SnapshotRelationshipsPanel from '../../common/overview/SchemaPanel';
import LoadingSpinner from '../../common/LoadingSpinner';
import { AppDispatch } from '../../../store';
import { SnapshotPendingSave } from '../../../reducers/snapshot';

const styles = () =>
  createStyles({
    pageRoot: {
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    root: {
      // TODO: expect this to change as more components are added
      height: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      flex: 1,
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
    pageTitle: {
      marginBottom: '1rem',
    },
  });

interface RouteParams {
  uuid: string;
}

type SnapshotProps = {
  dispatch: AppDispatch;
};

type AllSnapshotProps = SnapshotProps &
  RouteComponentProps<RouteParams> &
  StateProps &
  WithStyles<typeof styles>;

function SnapshotOverview(props: AllSnapshotProps) {
  const {
    classes,
    dispatch,
    match,
    pendingSave,
    snapshot,
    snapshotByIdLoading,
    snapshotPolicies,
    userRoles,
  } = props;
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
  });

  if (snapshotByIdLoading) {
    return <LoadingSpinner />;
  }

  return snapshotPolicies && snapshot && snapshot.tables && snapshot.id === snapshotId ? (
    <div className={classes.pageRoot}>
      <AppBreadcrumbs
        context={{
          type: BreadcrumbType.SNAPSHOT,
          id: snapshot.id || '',
          name: snapshot.name || '',
        }}
        childBreadcrumbs={[]}
      />
      <Typography variant="h3" className={classes.pageTitle}>
        {snapshot.name}
      </Typography>
      <div className={classes.root}>
        <div className={classes.infoColumn}>
          <div className={classes.infoColumnPanel}>
            <SnapshotRelationshipsPanel
              tables={snapshot.tables}
              resourceType="Snapshot"
              resourceId={snapshot.id}
            />
          </div>
        </div>
        <div className={classes.mainColumn}>
          <SnapshotOverviewPanel
            dispatch={dispatch}
            pendingSave={pendingSave}
            snapshot={snapshot}
            userRoles={userRoles}
          />
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
}

type StateProps = {
  pendingSave: SnapshotPendingSave;
  snapshot: SnapshotModel;
  snapshotByIdLoading: boolean;
  snapshotPolicies: PolicyModel[];
  userRoles: Array<string>;
};

function mapStateToProps(state: TdrState) {
  return {
    pendingSave: state.snapshots.pendingSave,
    snapshot: state.snapshots.snapshot,
    snapshotByIdLoading: state.snapshots.snapshotByIdLoading,
    snapshotPolicies: state.snapshots.snapshotPolicies,
    userRoles: state.snapshots.userRoles,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(SnapshotOverview));
