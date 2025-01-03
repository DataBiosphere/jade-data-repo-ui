import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action } from 'redux';
import { Button, Box, Typography } from '@mui/material';
import { CustomTheme } from '@mui/material/styles';
import { AddCircle, Refresh } from '@mui/icons-material';
import { RouterLocation, RouterRootState } from 'connected-react-router';
import { LocationState } from 'history';
import {
  getSnapshotAccessRequests,
  refreshDatasets,
  refreshJobs,
  refreshSnapshotAccessRequests,
  refreshSnapshots,
} from 'src/actions';
import { TdrState } from 'reducers';
import { useOnMount } from 'libs/utils';
import DatasetView from './DatasetView';
import SnapshotView from './SnapshotView';
import JobView from './JobView';
import SearchTable from './table/SearchTable';
import SnapshotAccessRequestView from './SnapshotAccessRequestView';

interface IProps {
  dispatch: Dispatch<Action>;
  location: RouterLocation<LocationState>;
  theme: CustomTheme;
}

function HomeView({ dispatch, location, theme }: IProps) {
  const [searchString, setSearchString] = useState('');
  const prefixMatcher = /\/[^/]*/;
  const tabValue = prefixMatcher.exec(location.pathname)?.[0];

  let pageTitle = 'Terra Data Repository';
  let searchable = true;
  let tableValue = <Box />;
  let refresh;
  if (tabValue === '/datasets') {
    pageTitle = 'Datasets';
    tableValue = <DatasetView searchString={searchString} />;
    refresh = () => dispatch(refreshDatasets());
  } else if (tabValue === '/snapshots') {
    pageTitle = 'Snapshots';
    tableValue = <SnapshotView searchString={searchString} />;
    refresh = () => dispatch(refreshSnapshots());
  } else if (tabValue === '/activity') {
    pageTitle = 'Activity';
    searchable = false;
    tableValue = <JobView searchString={searchString} />;
    refresh = () => dispatch(refreshJobs());
  } else if (tabValue === '/requests') {
    pageTitle = 'Requests';
    tableValue = <SnapshotAccessRequestView searchString={searchString} />;
    refresh = () => dispatch(refreshSnapshotAccessRequests());
  }
  const refreshButton = (
    <Button
      aria-label="refresh page"
      size="medium"
      sx={{ padding: '10px', marginLeft: '16px', height: '45px', textTransform: 'none' }}
      onClick={refresh}
      variant="outlined"
      startIcon={<Refresh />}
    >
      Refresh
    </Button>
  );
  const pageHeader =
    tabValue === '/datasets' ? (
      <Box
        sx={{
          flex: '1 1 0',
          paddingRight: '2em',
          display: 'flex',
        }}
      >
        <Typography
          sx={{ width: '150px', color: 'secondary.dark', fontSize: '1.5rem', fontWeight: 700 }}
        >
          {pageTitle}
        </Typography>
        {refreshButton}
        <Link to="datasets/new" data-cy="create-dataset-link">
          <Button
            sx={{ padding: '10px', marginLeft: '16px', height: '45px', textTransform: 'none' }}
            color="primary"
            variant="outlined"
            disableElevation
            size="medium"
          >
            <AddCircle sx={{ marginRight: '1px', fontSize: '1.5rem' }} /> Create Dataset
          </Button>
        </Link>
      </Box>
    ) : (
      <Box
        sx={{
          color: 'secondary.dark',
          fontSize: '1.5rem',
          fontWeight: 700,
          flex: '1 1 0',
          paddingRight: '2em',
          display: 'flex',
        }}
      >
        <Typography sx={{ width: '150px' }}>{pageTitle}</Typography>
        {refreshButton}
      </Box>
    );

  useOnMount(() => {
    dispatch(getSnapshotAccessRequests());
  });

  return (
    <Box
      sx={{
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          marginTop: '1.25em',
          marginBottom: '1.25em',
        }}
      >
        {pageHeader}
        {searchable && (
          <SearchTable
            searchString={searchString}
            onSearchStringChange={(event: any) => setSearchString(event.target.value)}
            clearSearchString={() => setSearchString('')}
          />
        )}
      </Box>
      {tableValue}
    </Box>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(HomeView);
