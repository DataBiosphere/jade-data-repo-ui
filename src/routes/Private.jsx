import React from 'react';
import { HashRouter, Link, Switch, Route } from 'react-router-dom';
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
  tabsIndicator: {
    borderBottom: '4px solid #74ae43',
  },
  tabsRoot: {
    paddingLeft: theme.spacing.unit * 3,
    borderBottom: '2px solid #74ae43',
    color: '#5c912e',
  },
  tabRoot: {},
  tabSelected: {
    backgroundColor: '#ddebd0',
  },
});

class Private extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location !== prevProps.location) {
      this.onRouteChanged(location.hash.split('/')[1]);
    }
  }

  onRouteChanged = value => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { classes } = this.props;
    return (
      <HashRouter>
        <div>
          <Tabs
            value={value}
            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          >
            <Tab
              label="Home"
              component={Link}
              value=""
              to="/"
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            />
            <Tab
              label="Studies"
              component={Link}
              value="studies"
              to="/studies"
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            />
            <Tab
              label="Datasets"
              component={Link}
              value="datasets"
              to="/datasets"
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
            />
          </Tabs>
          <Switch>
            <div>
              <Route exact path="/" component={HomeView} />
              <Route exact path="/studies" component={StudiesView} />
              <Route exact path="/studies/details/:uuid" component={StudyDetailView} />
              <Route exact path="/datasets" component={DatasetView} />
              <Route exact path="/datasets/create" component={DatasetCreateView} />
              <Route exact path="/datasets/preview" component={DatasetPreviewView} />
              <Route exact path="/datasets/details/:uuid" component={DatasetDetailView} />
            </div>
          </Switch>
        </div>
      </HashRouter>
    );
  }
}

export default withStyles(styles)(Private);
