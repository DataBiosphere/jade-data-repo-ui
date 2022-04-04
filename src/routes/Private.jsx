import React, { Fragment } from 'react';
import { Link, Redirect, Route, Router, Switch } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { withStyles } from '@mui/styles';
import { ConnectedRouter } from 'connected-react-router';
import PropTypes from 'prop-types';
import history from 'modules/hist';

import HelpContainer from 'components/help/HelpContainer';
import SnapshotOverview from 'components/SnapshotOverview';
import HomeView from '../components/HomeView';
import DatasetOverview from '../components/dataset/overview/DatasetOverview';
import DatasetDataView from '../components/dataset/data/DatasetDataView';
import SnapshotDataView from '../components/snapshot/data/SnapshotDataView';

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

class Private extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    features: PropTypes.object,
  };

  static prefixMatcher = /\/[^/]*/;

  render() {
    const { classes } = this.props;
    const dashboardTabValues = '/datasets' || '/snapshots';
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
                      value={dashboardTabValues}
                      classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                    >
                      <Tab
                        label="Dashboard"
                        component={Link}
                        value="/datasets"
                        to="/datasets"
                        classes={{ selected: classes.tabSelected }}
                        disableFocusRipple
                        disableRipple
                      />
                    </Tabs>
                    <HelpContainer className={classes.helpIconDiv} />
                  </div>
                  <div className={classes.component}>
                    <Switch>
                      <Route exact path="/" component={HomeView}>
                        <Redirect to="/datasets" />
                      </Route>
                      <Route exact path="/datasets" component={HomeView} />
                      <Route exact path="/snapshots" component={HomeView} />
                      <Route exact path="/datasets/:uuid" component={DatasetOverview} />
                      <Route exact path="/datasets/:uuid/data" component={DatasetDataView} />
                      <Route exact path="/snapshots/:uuid" component={SnapshotOverview} />
                      <Route exact path="/snapshots/:uuid/data" component={SnapshotDataView} />
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
