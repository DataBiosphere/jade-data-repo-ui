import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { WithStyles, withStyles } from '@mui/styles';
import { CustomTheme } from '@mui/material';
import { addSnapshotPolicyMember, getSnapshots } from 'actions/index';
import { SnapshotSummaryModel } from 'generated/tdr';
import { Action } from 'redux';
import { TdrState } from 'reducers';
import { OrderDirectionOptions } from 'reducers/query';

import SnapshotTable from './table/SnapshotTable';
import SnapshotPopup from './snapshot/SnapshotPopup';
import { SnapshotRoles } from '../constants';

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
    fontSize: 54,
    lineHeight: '66px',
    paddingBottom: theme.spacing(8),
  },
});

interface IProps extends WithStyles<typeof styles> {
  snapshots: Array<SnapshotSummaryModel>;
  snapshotRoleMaps: { [key: string]: Array<string> };
  snapshotCount: number;
  dispatch: Dispatch<Action>;
  filteredSnapshotCount: number;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
  user: string;
}

const SnapshotView = withStyles(styles)(
  ({
    classes,
    snapshots,
    snapshotRoleMaps,
    snapshotCount,
    dispatch,
    filteredSnapshotCount,
    loading,
    searchString,
    refreshCnt,
    user,
  }: IProps) => {
    const handleFilterSnapshots = (
      limit: number,
      offset: number,
      sort: string,
      sortDirection: OrderDirectionOptions,
      search: string,
    ) => {
      // TODO: should we allow filtering on dataset id here?
      const datasetIds: string[] = [];
      dispatch(getSnapshots(limit, offset, sort, sortDirection, search, datasetIds));
    };

    const handleMakeSteward = (snapshotID: string) => {
      dispatch(addSnapshotPolicyMember(snapshotID, user, SnapshotRoles.STEWARD));
    };

    return (
      <div id="snapshots" className={classes.wrapper}>
        <div className={classes.width}>
          <div>
            <SnapshotTable
              snapshotCount={snapshotCount}
              snapshotRoleMaps={snapshotRoleMaps}
              filteredSnapshotCount={filteredSnapshotCount}
              snapshots={snapshots}
              handleFilterSnapshots={handleFilterSnapshots}
              handleMakeSteward={handleMakeSteward}
              searchString={searchString}
              loading={loading}
              refreshCnt={refreshCnt}
            />
          </div>
        </div>
        <SnapshotPopup />
      </div>
    );
  },
);

function mapStateToProps(state: TdrState) {
  return {
    snapshots: state.snapshots.snapshots,
    snapshotRoleMaps: state.snapshots.snapshotRoleMaps,
    snapshotCount: state.snapshots.snapshotCount,
    filteredSnapshotCount: state.snapshots.filteredSnapshotCount,
    loading: state.snapshots.loading,
    user: state.user.email,
    refreshCnt: state.snapshots.refreshCnt,
  };
}

export default connect(mapStateToProps)(SnapshotView);
