import React, { Fragment } from 'react';
import { Link, Redirect, Route, Router, Switch } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { withStyles } from '@mui/styles';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import history from 'modules/hist';

import HelpContainer from 'components/help/HelpContainer';
import HomeView from '../components/HomeView';
import Features from '../components/common/Features';
import DatasetDataView from '../components/dataset/data/DatasetDataView';
import DatasetOverview from '../components/dataset/overview/DatasetOverview';
import DatasetSchemaCreationView from '../components/dataset/schemaCreation/DatasetSchemaCreationView';
import SnapshotDataView from '../components/snapshot/data/SnapshotDataView';
import SnapshotOverview from '../components/snapshot/overview/SnapshotOverview';
import NotFound from './NotFound';

const styles = (theme) => ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    paddingTop: 64,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabsIndicator: {
    borderBottom: '8px solid #74ae43',
  },
  tabsRoot: {
    borderBottom: `2px solid ${theme.palette.terra.green}`,
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
    color: '#333F52',
    fontFamily: theme.typography.fontFamily,
    height: 18,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 18,
    textAlign: 'center',
    width: '100%',
    transition: '0.3s background-color ease-in-out',
  },
  tabSelected: {
    transition: '0.3s background-color ease-in-out',
    backgroundColor: '#ddebd0',
    color: theme.palette.secondary.dark,
    fontWeight: '700 !important',
  },
  component: {
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tabWrapper: {
    display: 'flex',
    zIndex: 11,
  },
  helpIconDiv: {
    borderBottom: `2px solid ${theme.palette.terra.green}`,
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
    float: 'right',
    width: '20px',
  },
});

const tabsConfig = [
  { label: 'Datasets', path: '/datasets' },
  { label: 'Snapshots', path: '/snapshots' },
  { label: 'Activity', path: '/activity' },
  { label: 'Ingest Data', path: '/ingestdata' },
];

const routes = [
  { path: '/datasets', component: HomeView },
  { path: '/snapshots', component: HomeView },
  { path: '/datasets/new', component: DatasetSchemaCreationView },
  { path: '/datasets/:uuid', component: DatasetOverview },
  { path: '/datasets/:uuid/data', component: DatasetDataView },
  { path: '/snapshots/:uuid', component: SnapshotOverview },
  { path: '/snapshots/:uuid/data', component: SnapshotDataView },
  { path: '/activity', component: HomeView },
];

class Private extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    features: PropTypes.object,
  };

  static prefixMatcher = /\/[^/]*/;

  render() {
    const { classes } = this.props;
    const locationSplit = history.location.pathname.split('/');
    const selectedTab = `/${locationSplit[1] || 'datasets'}`;
    Features.initFeatures();
    return (
      <ConnectedRouter history={history}>
        <Router history={history}>
          <div className={classes.wrapper}>
            <Route
              path="/"
              render={() => (
                <Fragment>
                  <div className={classes.tabWrapper}>
                    <Tabs
                      value={selectedTab}
                      classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                    >
                      {tabsConfig
                        .filter(
                          (config) =>
                            routes.findIndex((route) => route.path === config.path) !== -1,
                        )
                        .map((config, i) => (
                          <Tab
                            key={`navbar-link-${i}`}
                            label={config.label}
                            component={Link}
                            value={config.path}
                            to={config.path}
                            classes={{ selected: classes.tabSelected }}
                            disableFocusRipple
                            disableRipple
                          />
                        ))}
                    </Tabs>
                    <HelpContainer className={classes.helpIconDiv} />
                  </div>
                  <div className={classes.component}>
                    <Switch>
                      <Route exact path="/" component={HomeView}>
                        <Redirect to="/datasets" />
                      </Route>
                      {routes.map((route, i) => (
                        <Route
                          exact
                          key={`route-${i}`}
                          path={route.path}
                          component={route.component}
                        />
                      ))}
                      <Route component={NotFound} />
                    </Switch>
                  </div>
                </Fragment>
              )}
            />
          </div>
        </Router>
      </ConnectedRouter>
    );
  }
}

export default withStyles(styles)(Private);
