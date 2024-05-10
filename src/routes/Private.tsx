import React, { Fragment } from 'react';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { CustomTheme } from '@mui/material/styles';
import { createStyles, WithStyles, withStyles } from '@mui/styles';
import { ConnectedRouter } from 'connected-react-router';
import history from 'modules/hist';

import { History, LocationState } from 'history';
import TabWrapper from 'components/common/TabWrapper';
import HomeView from '../components/HomeView';
import DatasetDataView from '../components/dataset/data/DatasetDataView';
import DatasetOverview from '../components/dataset/overview/DatasetOverview';
import DatasetSchemaCreationView from '../components/dataset/schemaCreation/DatasetSchemaCreationView';
import SnapshotDataView from '../components/snapshot/data/SnapshotDataView';
import SnapshotOverview from '../components/snapshot/overview/SnapshotOverview';
import NotFound from './NotFound';

const styles = (theme: CustomTheme) =>
  createStyles({
    wrapper: {
      fontFamily: theme.typography.fontFamily,
      paddingTop: 64,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    component: {
      overflow: 'auto',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 1,
    },
  });

export interface IRoute {
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
  { path: '/snapshot-access-requests', component: HomeView },
];

function Private({ classes }: WithStyles<typeof styles>) {
  return (
    <ConnectedRouter history={history as History<LocationState>}>
      <Router history={history}>
        <div className={classes.wrapper}>
          <Route
            path="/"
            render={() => (
              <Fragment>
                <TabWrapper routes={routes} />
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
