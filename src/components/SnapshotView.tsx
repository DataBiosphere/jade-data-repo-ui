import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import { addSnapshotPolicyMember, getSnapshots } from 'actions/index';
import { SnapshotSummaryModel } from 'generated/tdr';
import { Action } from 'redux';
import { TdrState } from 'reducers';
import { OrderDirectionOptions } from 'reducers/query';
import { CustomTheme, styled } from '@mui/material/styles';
import SnapshotTable from './table/SnapshotTable';
import SnapshotPopup from './snapshot/SnapshotPopup';
import { SnapshotRoles } from '../constants';

const Container = styled('div')(({ theme }: { theme: CustomTheme }) => theme.mixins.containerWidth);

interface IProps {
  snapshots: Array<SnapshotSummaryModel>;
  snapshotRoleMaps: { [key: string]: Array<string> };
  snapshotCount: number;
  dispatch: Dispatch<Action>;
  filteredSnapshotCount: number;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
  userEmail: string;
}

function SnapshotView({
  snapshots,
  snapshotRoleMaps,
  snapshotCount,
  dispatch,
  filteredSnapshotCount,
  loading,
  searchString,
  refreshCnt,
  userEmail,
}: IProps) {
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
    dispatch(addSnapshotPolicyMember(snapshotID, userEmail, SnapshotRoles.STEWARD));
  };

  return (
    <Box
      id="snapshots"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1em',
      }}
    >
      <Container>
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
      </Container>
      <SnapshotPopup />
    </Box>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    snapshots: state.snapshots.snapshots,
    snapshotRoleMaps: state.snapshots.snapshotRoleMaps,
    snapshotCount: state.snapshots.snapshotCount,
    filteredSnapshotCount: state.snapshots.filteredSnapshotCount,
    loading: state.snapshots.loading,
    userEmail: state.user.email,
    refreshCnt: state.snapshots.refreshCnt,
  };
}

export default connect(mapStateToProps)(SnapshotView);
