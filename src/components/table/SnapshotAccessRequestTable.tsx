import React, { Dispatch } from 'react';
import { SnapshotAccessRequestResponse } from 'generated/tdr';
import { TableColumnType } from 'reducers/query';
import LightTable from 'components/table/LightTable';
import moment from 'moment/moment';
import { Button } from '@mui/material';
import _ from 'lodash';
import { approveSnapshotAccessRequest, rejectSnapshotAccessRequest } from 'actions';
import { Action } from 'redux';
import { Link } from 'react-router-dom';
import { ClassNameMap, withStyles } from '@mui/styles';
import { CustomTheme } from '@mui/material/styles';
import ModalTrigger from 'components/common/ModalTrigger';

const styles = (theme: CustomTheme) => ({
  jadeLink: {
    ...theme.mixins.jadeLink,
  },
});

interface IProps {
  classes: ClassNameMap;
  dispatch: Dispatch<Action>;
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
}

function SnapshotAccessRequestTable({
  classes,
  dispatch,
  snapshotAccessRequests,
  loading,
  searchString,
  refreshCnt,
}: IProps) {
  const containsSearchString = (request: SnapshotAccessRequestResponse): boolean =>
    _.includes(request.id, searchString) ||
    _.includes(request.snapshotName, searchString) ||
    _.includes(request.sourceSnapshotId, searchString) ||
    _.includes(request.createdBy, searchString);

  const filteredRequests = _.filter(
    snapshotAccessRequests,
    (snapshotAccessRequest: SnapshotAccessRequestResponse) =>
      containsSearchString(snapshotAccessRequest),
  );

  const filteredAndSortedRequests = _.sortBy(
    filteredRequests,
    (snapshotAccessRequest: SnapshotAccessRequestResponse) =>
      Date.parse(
        snapshotAccessRequest.createdDate ? snapshotAccessRequest.createdDate : _.now().toString(),
      ) * -1,
  );

  const columns: Array<TableColumnType> = [
    {
      label: 'Request Name',
      name: 'snapshotName',
      render: (row: SnapshotAccessRequestResponse) => (
        <ModalTrigger
          modalText={row.snapshotName}
          modalHeading={`Summary for: ${row.snapshotName}`}
          modalContent={row.summary}
        />
      ),
      width: '16%',
    },
    {
      label: 'Request Id',
      name: 'id',
      render: (row: SnapshotAccessRequestResponse) => row.id || '',
      width: '12%',
    },
    {
      label: 'Source Snapshot Id',
      name: 'sourceSnapshotId',
      render: (row: SnapshotAccessRequestResponse) => row.sourceSnapshotId || '',
      width: '12%',
    },
    {
      label: 'Created Snapshot Id',
      name: 'createdSnapshotId',
      render: (row: SnapshotAccessRequestResponse) => (
        <Link to={`/snapshots/${row.createdSnapshotId}`}>
          <span className={classes.jadeLink}>{row.createdSnapshotId}</span>
        </Link>
      ),
      width: '12%',
    },
    {
      label: 'Created By',
      name: 'createdBy',
      render: (row: SnapshotAccessRequestResponse) => row.createdBy || '',
      width: '13%',
    },
    {
      label: 'Date Requested',
      name: 'createdDate',
      render: (row: SnapshotAccessRequestResponse) => moment(row.createdDate).fromNow(),
      width: '10%',
    },
    {
      label: 'Status',
      name: 'status',
      render: (row: SnapshotAccessRequestResponse) => row.status || '',
      width: '10%',
    },
    {
      label: '',
      name: 'Actions',
      render: (row: SnapshotAccessRequestResponse) => (
        <div>
          <Button
            color="primary"
            onClick={() => row.id && dispatch(rejectSnapshotAccessRequest(row.id))}
          >
            Reject
          </Button>
          <Button
            color="primary"
            onClick={() => row.id && dispatch(approveSnapshotAccessRequest(row))}
          >
            Approve
          </Button>
        </div>
      ),
      width: '15%',
    },
  ];
  return (
    <div>
      <LightTable
        columns={columns}
        noRowsMessage="No requests are pending review"
        rows={filteredAndSortedRequests}
        filteredCount={filteredAndSortedRequests.length}
        loading={loading}
        refreshCnt={refreshCnt}
        totalCount={snapshotAccessRequests.length}
      />
    </div>
  );
}

export default withStyles(styles)(SnapshotAccessRequestTable);
