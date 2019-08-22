import React, { Fragment } from 'react';
import { Router, Link, Switch, Route } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import history from 'modules/hist';

import HomeView from '../components/HomeView';
import DatasetsView from '../components/DatasetView';
import SnapshotView from '../components/SnapshotView';
import SnapshotCreateView from '../components/SnapshotCreateView';
import SnapshotPreviewView from '../components/SnapshotPreviewView';
import SnapshotDetailView from '../components/SnapshotDetailView';
import DatasetDetailView from '../components/DatasetDetailView';
import QueryView from '../components/dataset/query/QueryView';

const styles = theme => ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
  },
  tabsIndicator: {
    borderBottom: '8px solid #74ae43',
  },
  tabsRoot: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    boxShadow: '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
    color: '#333F52',
    fontFamily: theme.typography.fontFamily,
    paddingLeft: theme.spacing(11.5),
    height: 18,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 18,
    textAlign: 'center',
  },
  tabSelected: {
    backgroundColor: '#ddebd0',
    color: theme.palette.secondary.dark,
  },
});

class Private extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static prefixMatcher = new RegExp('/[^/]*');

  render() {
    const { classes } = this.props;
    return (
      <Router history={history}>
        <div className={classes.wrapper}>
          <Route
            path="/"
            render={({ location }) => (
              <Fragment>
                <Tabs
                  value={Private.prefixMatcher.exec(location.pathname)[0]}
                  classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                >
                  <Tab
                    label="Home"
                    component={Link}
                    value="/"
                    to="/"
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  />
                  <Tab
                    label="Datasets"
                    component={Link}
                    value="/datasets"
                    to="/datasets"
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  />
                  <Tab
                    label="Snapshots"
                    component={Link}
                    value="/snapshots"
                    to="/snapshots"
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  />
                  <Tab
                    label="Queries"
                    component={Link}
                    value="/queries"
                    to="/queries"
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  />
                </Tabs>
                <Switch>
                  <Route exact path="/" component={HomeView} />
                  <Route exact path="/datasets" component={DatasetsView} />
                  <Route exact path="/datasets/details/:uuid" component={DatasetDetailView} />
                  <Route exact path="/queries/" component={QueryView} />
                  <Route exact path="/snapshots" component={SnapshotView} />
                  <Route exact path="/snapshots/create" component={SnapshotCreateView} />
                  <Route exact path="/snapshots/requests/:jobId" component={SnapshotPreviewView} />
                  <Route exact path="/snapshots/details/:uuid" component={SnapshotDetailView} />
                </Switch>
              </Fragment>
            )}
          />
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(Private);
