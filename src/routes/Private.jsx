import React from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import { Container, Screen } from 'styled-minimal';

import HomeView from '../components/HomeView';
import StudiesView from '../components/StudyView';
import DatasetView from '../components/DatasetView';
import DatasetCreateView from '../components/DatasetCreateView';

class Private extends React.Component {
  render() {
    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <Container verticalPadding>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/studies">Studies</NavLink>
            </li>
            <li>
              <NavLink to="/datasets">Datasets</NavLink>
            </li>
          </ul>
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route exact path="/studies" component={StudiesView} />
            <Route exact path="/datasets" component={DatasetView} />
            <Route exact path="/datasets/create" component={DatasetCreateView} />
          </Switch>
        </Container>
      </Screen>
    );
  }
}

export default Private;
