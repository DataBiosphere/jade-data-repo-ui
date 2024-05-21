import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import { SnapshotAccessRequestResponse } from 'generated/tdr';
import React, { Dispatch } from 'react';
import SnapshotAccessRequestTable from 'components/table/SnapshotAccessRequestTable';
import { Action } from 'redux';

interface IProps {
  dispatch: Dispatch<Action>;
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
  loading: boolean;
  refreshCnt: number;
  searchString: string;
}

function SnapshotAccessRequestView({
  dispatch,
  snapshotAccessRequests,
  loading,
  refreshCnt,
  searchString,
}: IProps) {
  return (
    <SnapshotAccessRequestTable
      dispatch={dispatch}
      snapshotAccessRequests={snapshotAccessRequests}
      loading={loading}
      refreshCnt={refreshCnt}
      searchString={searchString}
    />
  );
}

function mapStateToProps(state: TdrState) {
  return {
    snapshotAccessRequests: state.snapshotAccessRequests.snapshotAccessRequests,
    loading: state.snapshotAccessRequests.loading,
    userEmail: state.user.email,
    refreshCnt: state.snapshotAccessRequests.refreshCnt,
  };
}

export default connect(mapStateToProps)(SnapshotAccessRequestView);
