import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import DatasetView from './DatasetView';
import SnapshotView from './SnapshotView';
import JobView from './JobView';
import SearchTable from './table/SearchTable';

const styles = (theme) => ({
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
  },
  titleAndSearch: {
    display: 'flex',
    'margin-top': '1.25em',
    'margin-bottom': '1.25em',
  },
});

function HomeView({ classes, location }) {
  const prefixMatcher = /\/[^/]*/;
  const [searchString, setSearchString] = useState('');
  const tabValue = prefixMatcher.exec(location.pathname)[0];
  let tableValue;
  let pageTitle = 'Terra Data Respository';
  let searchable = true;

  if (tabValue === '/datasets') {
    tableValue = <DatasetView searchString={searchString} />;
  } else if (tabValue === '/snapshots') {
    tableValue = <SnapshotView searchString={searchString} />;
  } else if (tabValue === '/activity') {
    pageTitle = 'Activity';
    searchable = false;
    tableValue = <JobView searchString={searchString} />;
  } else {
    tableValue = <div />;
  }

  return (
    <div className={classes.pageRoot}>
      <div className={classes.titleAndSearch}>
        <div className={classes.title}>{pageTitle}</div>
        {searchable && (
          <SearchTable
            searchString={searchString}
            onSearchStringChange={(event) => setSearchString(event.target.value)}
            clearSearchString={() => setSearchString('')}
          />
        )}
      </div>
      {tableValue}
    </div>
  );
}

HomeView.propTypes = {
  classes: PropTypes.object,
  location: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    location: state.router.location,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(HomeView));
