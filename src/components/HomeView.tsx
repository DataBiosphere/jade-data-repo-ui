import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action } from 'redux';
import { Button } from '@mui/material';
import { AddCircle, Refresh } from '@mui/icons-material';
import { styled } from '@mui/system';
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

const PageRoot = styled('div')(({ theme }) => ({
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const Header = styled('div')(({ theme }) => ({
  alignItems: 'center',
  color: theme.typography.color,
  display: 'flex',
  fontWeight: 500,
  fontSize: 16,
  height: 21,
  letterSpacing: 1,
}));

const JadeTableSpacer = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(12),
}));

const JadeLink = styled(Link)(({ theme }) => ({
  ...theme.mixins.jadeLink,
  float: 'right',
  fontSize: 16,
  fontWeight: 500,
  height: 20,
  letterSpacing: 0.3,
  paddingLeft: theme.spacing(4),
  paddingTop: theme.spacing(4),
}));

const Title = styled('div')(({ theme }) => ({
  color: theme.palette.secondary.dark,
  fontSize: '1.5rem',
  fontWeight: 700,
  flex: '1 1 0',
  paddingRight: '2em',
  display: 'flex',
}));

const TitleText = styled('span')({
  width: '150px',
});

const TitleAndSearch = styled('div')({
  display: 'flex',
  marginTop: '1.25em',
  marginBottom: '1.25em',
});

const HeaderButton = styled(Button)(({ theme }) => ({
  padding: 10,
  marginLeft: theme.spacing(2),
  height: '45px',
  textTransform: 'none',
}));

const ButtonIcon = styled(AddCircle)({
  marginRight: 6,
  fontSize: '1.5rem',
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
      <Title>
        <TitleText>{pageTitle}</TitleText>
        {refreshButton}
        <JadeLink to="datasets/new" data-cy="create-dataset-link">
          <HeaderButton color="primary" variant="outlined" disableElevation size="medium">
            <ButtonIcon /> Create Dataset
          </HeaderButton>
        </JadeLink>
      </Title>
    ) : (
      <Title>
        <TitleText>{pageTitle}</TitleText>
        {refreshButton}
      </Title>
    );

  useOnMount(() => {
    dispatch(getSnapshotAccessRequests());
  });

  return (
    <PageRoot>
      <TitleAndSearch>
        {pageHeader}
        {searchable && (
          <SearchTable
            searchString={searchString}
            onSearchStringChange={(event: any) => setSearchString(event.target.value)}
            clearSearchString={() => setSearchString('')}
          />
        )}
      </TitleAndSearch>
      {tableValue}
    </PageRoot>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(HomeView);
