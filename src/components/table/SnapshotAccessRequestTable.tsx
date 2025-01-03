import React, { Dispatch, useEffect, useState } from 'react';
import { SnapshotAccessRequestResponse, SnapshotAccessRequestDetailsResponse } from 'generated/tdr';
import { TableColumnType } from 'reducers/query';
import LightTable from 'components/table/LightTable';
import moment from 'moment/moment';
import { Button, Box } from '@mui/material';
import _ from 'lodash';
import {
  approveSnapshotAccessRequest,
  getSnapshotAccessRequestDetails,
  rejectSnapshotAccessRequest,
} from 'actions';
import { Action } from 'redux';
import { Link } from 'react-router-dom';
import TextWithModalDetails from 'components/common/InfoModal';
import LoadingSpinner from 'components/common/LoadingSpinner';

interface IProps {
  dispatch: Dispatch<Action>;
  snapshotAccessRequests: Array<SnapshotAccessRequestResponse>;
  snapshotAccessRequestDetails?: SnapshotAccessRequestDetailsResponse;
  loadingSnapshotAccessRequestDetails: boolean;
  loading: boolean;
  searchString: string;
  refreshCnt: number;
}

function SnapshotAccessRequestTable({
  dispatch,
  snapshotAccessRequests,
  snapshotAccessRequestDetails,
  loadingSnapshotAccessRequestDetails,
  loading,
  searchString,
  refreshCnt,
}: IProps) {
  const [
    selectedAccessRequest,
    setSelectedAccessRequest,
  ] = useState<SnapshotAccessRequestResponse>();
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

  const openDetailsModal = (request: SnapshotAccessRequestResponse) => {
    setSelectedAccessRequest(request);
  };

  useEffect(() => {
    selectedAccessRequest?.id !== undefined &&
      dispatch(getSnapshotAccessRequestDetails(selectedAccessRequest.id));
  }, [dispatch, selectedAccessRequest]);

  const columns: Array<TableColumnType> = [
    {
      label: 'Request Name',
      name: 'snapshotName',
      render: (row: SnapshotAccessRequestResponse) => (
        <Button
          sx={{
            width: '100%',
            border: 0,
            justifyContent: 'left',
            textTransform: 'none',
            paddingTop: '8px',
            paddingBottom: '8px',
            '&:hover': { border: 0 },
          }}
          aria-label={row.snapshotName}
          onClick={() => openDetailsModal(row)}
          disableFocusRipple={true}
          disableRipple={true}
        >
          {row.snapshotName}
        </Button>
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
          <Box sx={{ color: 'primary.main', textDecoration: 'underline' }}>
            {row.createdSnapshotId}
          </Box>
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
        <Box>
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
        </Box>
      ),
      width: '15%',
    },
  ];
  return (
    <>
      <Box>
        <LightTable
          columns={columns}
          noRowsMessage="No requests are pending review"
          rows={filteredAndSortedRequests}
          filteredCount={filteredAndSortedRequests.length}
          loading={loading}
          refreshCnt={refreshCnt}
          totalCount={snapshotAccessRequests.length}
        />
      </Box>
      {loadingSnapshotAccessRequestDetails ? (
        <LoadingSpinner
          sx={{
            opacity: 0.9,
            position: 'absolute',
            right: 0,
            bottom: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'clip',
            backgroundColor: 'common.white',
            zIndex: 100,
          }}
        />
      ) : (
        selectedAccessRequest &&
        snapshotAccessRequestDetails && (
          <TextWithModalDetails
            modalHeading={`Summary for: ${selectedAccessRequest.snapshotName}`}
            modalContent={snapshotAccessRequestDetails.summary}
            onDismiss={() => setSelectedAccessRequest(undefined)}
          />
        )
      )}
    </>
  );
}

export default SnapshotAccessRequestTable;
