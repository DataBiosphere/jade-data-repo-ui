import React, { Fragment } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import { Container, Screen } from 'styled-minimal';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HomeView from '../components/HomeView';
import StudiesView from '../components/StudyView';
import DatasetView from '../components/DatasetView';
import DatasetCreateView from '../components/DatasetCreateView';

class Private extends React.Component {
  render() {
    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <Container verticalPadding>
          <Route
            path="/"
            render={({ location }) => (
              <Fragment>
                <AppBar position="static">
                  <Tabs value={location.pathname && '/' + location.pathname.split('/')[1]}>
                    <Tab label="Home" value="/" component={Link} to="/" />
                    <Tab label="Studies" value="/studies" component={Link} to="/studies" />
                    <Tab label="Datasets" value="/datasets" component={Link} to="/datasets" />
                  </Tabs>
                </AppBar>
                <Switch>
                  <Route exact path="/" component={HomeView} />
                  <Route exact path="/studies" component={StudiesView} />
                  <Route exact path="/datasets" component={DatasetView} />
                  <Route exact path="/datasets/create" component={DatasetCreateView} />
                </Switch>
              </Fragment>
            )}
          />
        </Container>
      </Screen>
    );
  }
}

export default Private;
