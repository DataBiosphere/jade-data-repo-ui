import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action } from 'redux';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AddCircle, Refresh } from '@mui/icons-material';
import { RouterLocation, RouterRootState } from 'connected-react-router';
import {
  getSnapshotAccessRequests,
  refreshDatasets,
  refreshJobs,
  refreshSnapshotAccessRequests,
  refreshSnapshots,
} from 'src/actions';
import { TdrState } from 'reducers';
import { useOnMount } from 'libs/utils';
import { LocationState } from 'history';
import DatasetView from './DatasetView';
import SnapshotView from './SnapshotView';
import JobView from './JobView';
import SearchTable from './table/SearchTable';
import SnapshotAccessRequestView from './SnapshotAccessRequestView';

const RootContainer = styled(Box)({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const TitleContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  fontSize: '1.5rem',
  fontWeight: 700,
  flex: '1 1 0',
  paddingRight: '2em',
  display: 'flex',
}));

const HeaderButton = styled(Button)({
  padding: '10px',
  marginLeft: '16px',
  height: '45px',
  textTransform: 'none',
});

interface IProps {
  dispatch: Dispatch<Action>;
  location: RouterLocation<LocationState>;
}

function HomeView({ dispatch, location }: IProps) {
  const [searchString, setSearchString] = useState('');
  const prefixMatcher = /\/[^/]*/;
  const tabValue = prefixMatcher.exec(location.pathname)?.[0];

  let pageTitle = 'Terra Data Repository';
  let searchable = true;
  let tableValue = <div />;
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
    <HeaderButton
      aria-label="refresh page"
      size="medium"
      onClick={refresh}
      variant="outlined"
      startIcon={<Refresh />}
    >
      Refresh
    </HeaderButton>
  );
  const pageHeader =
    tabValue === '/datasets' ? (
      <TitleContainer>
        <Box sx={{ width: '150px' }}>{pageTitle}</Box>
        {refreshButton}
        <Link to="datasets/new" data-cy="create-dataset-link">
          <HeaderButton color="primary" variant="outlined" disableElevation size="medium">
            <AddCircle sx={{ marginRight: '6px', fontSize: '1.5rem' }} /> Create Dataset
          </HeaderButton>
        </Link>
      </TitleContainer>
    ) : (
      <TitleContainer>
        <Box sx={{ width: '150px' }}>{pageTitle}</Box>
        {refreshButton}
      </TitleContainer>
    );

  useOnMount(() => {
    dispatch(getSnapshotAccessRequests());
  });

  return (
    <RootContainer>
      <Box sx={{ display: 'flex', mt: '1.25em', mb: '1.25em' }}>
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
    </RootContainer>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(HomeView);
