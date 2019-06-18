import React, { Fragment } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import HomeView from '../components/HomeView';
import StudiesView from '../components/StudyView';
import DatasetView from '../components/DatasetView';
import DatasetCreateView from '../components/DatasetCreateView';
import DatasetPreviewView from '../components/DatasetPreviewView';
import DatasetDetailView from '../components/DatasetDetailView';
import StudyDetailView from '../components/StudyDetailView';

const styles = theme => ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
  },
  tabsIndicator: {
    borderBottom: '8px solid #74ae43',
  },
  tabsRoot: {
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    boxShadow: `0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)`,
    color: '#333F52',
    fontFamily: theme.typography.fontFamily,
    paddingLeft: theme.spacing.unit * 11.5,
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
      <Router>
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
                    label="Studies"
                    component={Link}
                    value="/studies"
                    to="/studies"
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  />
                  <Tab
                    label="Datasets"
                    component={Link}
                    value="/datasets"
                    to="/datasets"
                    classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                  />
                </Tabs>
                <Switch>
                  <Route exact path="/" component={HomeView} />
                  <Route exact path="/studies" component={StudiesView} />
                  <Route exact path="/studies/details/:uuid" component={StudyDetailView} />
                  <Route exact path="/datasets" component={DatasetView} />
                  <Route exact path="/datasets/create" component={DatasetCreateView} />
                  <Route exact path="/datasets/requests/:jobId" component={DatasetPreviewView} />
                  <Route exact path="/datasets/details/:uuid" component={DatasetDetailView} />
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
