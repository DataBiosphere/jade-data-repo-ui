import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import { SnapshotAccessRequestResponse } from 'generated/tdr';
import React from 'react';

interface IProps {
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
}

function SnapshotAccessRequestView({ snapshotAccessRequests }: IProps) {
  return (
    <ul>
      {snapshotAccessRequests.map((accessRequest, index) => (
        <li key={index}>{accessRequest.id}</li>
      ))}
    </ul>
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
