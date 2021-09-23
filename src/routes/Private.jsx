import React, { Fragment } from 'react';
import { Router, Link, Switch, Route } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import history from 'modules/hist';

import HomeView from '../components/HomeView';
import DatasetsView from '../components/DatasetView';
import SnapshotView from '../components/SnapshotView';
import SnapshotDetailView from '../components/SnapshotDetailView';
import DatasetDetailView from '../components/dataset/details/DatasetDetailView';
import QueryView from '../components/dataset/query/QueryView';
import DataExplorerView from '../components/search/DataExplorerView';

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
    transition: 'none',
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
  component: {
    overflow: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
});

class Private extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    features: PropTypes.object,
  };

  static prefixMatcher = new RegExp('/[^/]*');

  render() {
    const { classes, features } = this.props;
    return (
      <ConnectedRouter history={history}>
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
                      classes={{ selected: classes.tabSelected }}
                      disableFocusRipple
                      disableRipple
                    />
                    {features.searchui && (
                      <Tab
                        label="Data Explorer"
                        component={Link}
                        value="/explorer"
                        to="/explorer"
                        classes={{ selected: classes.tabSelected }}
                        disableFocusRipple
                        disableRipple
                      />
                    )}
                    <Tab
                      label="Datasets"
                      component={Link}
                      value="/datasets"
                      to="/datasets"
                      classes={{ selected: classes.tabSelected }}
                      disableFocusRipple
                      disableRipple
                    />
                    <Tab
                      label="Snapshots"
                      component={Link}
                      value="/snapshots"
                      to="/snapshots"
                      classes={{ selected: classes.tabSelected }}
                      disableFocusRipple
                      disableRipple
                    />
                  </Tabs>
                  <div className={classes.component}>
                    <Switch>
                      <Route exact path="/" component={HomeView} />
                      {features.searchui && (
                        <Route exact path="/explorer" component={DataExplorerView} />
                      )}
                      <Route exact path="/datasets" component={DatasetsView} />
                      <Route exact path="/datasets/:uuid/query" component={QueryView} />
                      <Route exact path="/datasets/:uuid/details" component={DatasetDetailView} />
                      <Route exact path="/snapshots" component={SnapshotView} />
                      <Route exact path="/snapshots/details/:uuid" component={SnapshotDetailView} />
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
