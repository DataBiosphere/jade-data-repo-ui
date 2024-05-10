import { TdrState } from 'reducers';
import { connect } from 'react-redux';
import { WithStyles, withStyles } from '@mui/styles';
import { CustomTheme } from '@mui/material/styles';
import { SnapshotAccessRequestResponse } from 'generated/tdr';
import React, { Dispatch } from 'react';
import { Action } from 'redux';

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
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
  dispatch: Dispatch<Action>;
  loading: boolean;
  refreshCnt: number;
  userEmail: string;
}

const SnapshotAccessRequestView = withStyles(styles)(({ snapshotAccessRequests }: IProps) => (
  <ul>
    {snapshotAccessRequests.map((accessRequest, index) => (
      <li key={index}>{accessRequest.id}</li>
    ))}
  </ul>
));

function mapStateToProps(state: TdrState) {
  return {
    snapshotAccessRequests: state.snapshotAccessRequests.snapshotAccessRequests,
    loading: state.snapshotAccessRequests.loading,
    userEmail: state.user.email,
    refreshCnt: state.snapshotAccessRequests.refreshCnt,
  };
}

export default connect(mapStateToProps)(SnapshotAccessRequestView);
