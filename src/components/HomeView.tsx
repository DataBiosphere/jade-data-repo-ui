import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Action } from 'redux';

import { Button } from '@mui/material';
import { AddCircle, Refresh } from '@mui/icons-material';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { CustomTheme } from '@mui/material/styles';
import { RouterLocation, RouterRootState } from 'connected-react-router';
import { LocationState } from 'history';
import { refreshDatasets, refreshJobs, refreshSnapshots } from 'src/actions';
import DatasetView from './DatasetView';
import SnapshotView from './SnapshotView';
import JobView from './JobView';
import SearchTable from './table/SearchTable';
import { TdrState } from '../reducers';

const styles = (theme: CustomTheme) =>
  createStyles({
    pageRoot: {
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    header: {
      alignItems: 'center',
      color: theme.typography.color,
      display: 'flex',
      fontWeight: 500,
      fontSize: 16,
      height: 21,
      letterSpacing: 1,
    },
    jadeTableSpacer: {
      paddingBottom: theme.spacing(12),
    },
    jadeLink: {
      ...theme.mixins.jadeLink,
      float: 'right',
      fontSize: 16,
      fontWeight: 500,
      height: 20,
      letterSpacing: 0.3,
      paddingLeft: theme.spacing(4),
      paddingTop: theme.spacing(4),
    },
    title: {
      color: theme.palette.secondary.dark,
      fontSize: '1.5rem',
      fontWeight: 700,
      flex: '1 1 0',
      'padding-right': '2em',
      display: 'flex',
    },
    titleText: {
      width: '150px',
    },
    titleAndSearch: {
      display: 'flex',
      'margin-top': '1.25em',
      'margin-bottom': '1.25em',
    },
    headerButton: {
      padding: 10,
      marginLeft: theme.spacing(2),
      height: '45px',
      textTransform: 'none',
    },
    buttonIcon: {
      marginRight: 6,
      fontSize: '1.5rem',
    },
  });

interface IProps extends WithStyles<typeof styles> {
  dispatch: Dispatch<Action>;
  location: RouterLocation<LocationState>;
}

function HomeView({ classes, dispatch, location }: IProps) {
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
  }
  const refreshButton = (
    <Button
      aria-label="refresh page"
      size="medium"
      className={classes.headerButton}
      onClick={refresh}
      variant="outlined"
      startIcon={<Refresh />}
    >
      Refresh
    </Button>
  );
  const pageHeader =
    tabValue === '/datasets' ? (
      <div className={classes.title}>
        <span className={classes.titleText}>{pageTitle}</span>
        {refreshButton}
        <Link to="datasets/new" data-cy="create-dataset-link">
          <Button
            className={classes.headerButton}
            color="primary"
            variant="outlined"
            disableElevation
            size="medium"
          >
            <AddCircle className={classes.buttonIcon} /> Create Dataset
          </Button>
        </Link>
      </div>
    ) : (
      <div className={classes.title}>
        <span className={classes.titleText}>{pageTitle}</span>
        {refreshButton}
      </div>
    );

  return (
    <div className={classes.pageRoot}>
      <div className={classes.titleAndSearch}>
        {pageHeader}
        {searchable && (
          <SearchTable
            searchString={searchString}
            onSearchStringChange={(event: any) => setSearchString(event.target.value)}
            clearSearchString={() => setSearchString('')}
          />
        )}
      </div>
      {tableValue}
    </div>
  );
}

function mapStateToProps(state: TdrState & RouterRootState) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(HomeView));
