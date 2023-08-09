import React, { Fragment } from 'react';
import { Link, Redirect, Route, Router, Switch } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomTheme } from '@mui/material/styles';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { ConnectedRouter } from 'connected-react-router';
import history from 'modules/hist';

import HelpContainer from '../components/help/HelpContainer';
import HomeView from '../components/HomeView';
import DatasetDataView from '../components/dataset/data/DatasetDataView';
import DatasetOverview from '../components/dataset/overview/DatasetOverview';
import DatasetSchemaCreationView from '../components/dataset/schemaCreation/DatasetSchemaCreationView';
import SnapshotDataView from '../components/snapshot/data/SnapshotDataView';
import SnapshotOverview from '../components/snapshot/overview/SnapshotOverview';
import { TabClasses } from '@mui/material/Tab/tabClasses';
import NotFound from './NotFound';
import { History, LocationState } from 'history';

const styles = (theme: CustomTheme) =>
  createStyles({
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

interface ITabConfig {
  label: string;
  path: string;
}
const tabConfigs: Array<ITabConfig> = [
  { label: 'Datasets', path: '/datasets' },
  { label: 'Snapshots', path: '/snapshots' },
  { label: 'Activity', path: '/activity' },
  { label: 'Ingest Data', path: '/ingestdata' },
];

interface IRoute {
  path: string;
  component: any;
}
const routes: Array<IRoute> = [
  { path: '/datasets', component: HomeView },
  { path: '/snapshots', component: HomeView },
  { path: '/datasets/new', component: DatasetSchemaCreationView },
  { path: '/datasets/:uuid', component: DatasetOverview },
  { path: '/datasets/:uuid/data', component: DatasetDataView },
  { path: '/snapshots/:uuid', component: SnapshotOverview },
  { path: '/snapshots/:uuid/data', component: SnapshotDataView },
  { path: '/activity', component: HomeView },
];

function Private({ classes }: WithStyles<typeof styles>) {
  const locationSplit = history.location.pathname.split('/');
  const selectedTab = `/${locationSplit[1] || 'datasets'}`;
  return (
    <ConnectedRouter history={history as History<LocationState>}>
      <Router history={history}>
        <div className={classes.wrapper}>
          <Route
            path="/"
            render={() => (
              <Fragment>
                <div className={classes.tabWrapper}>
                  <Tabs
                    value={selectedTab}
                    classes={
                      {
                        root: classes.tabsRoot,
                        indicator: classes.tabsIndicator,
                      } as Partial<TabClasses>
                    }
                  >
                    {tabConfigs
                      .filter(
                        (config: ITabConfig) =>
                          routes.findIndex((route: IRoute) => route.path === config.path) !== -1,
                      )
                      .map((config: ITabConfig, i: number) => (
                        <Tab
                          key={`navbar-link-${i}`}
                          label={config.label}
                          component={Link}
                          value={config.path}
                          to={config.path}
                          classes={{ selected: classes.tabSelected } as Partial<TabClasses>}
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
                    {routes.map((route: IRoute, i: number) => (
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

export default withStyles(styles)(Private);
