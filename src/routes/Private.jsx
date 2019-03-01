import React from 'react';
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom';
import { Container, Screen } from 'styled-minimal';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import HomeView from '../components/HomeView';
import StudiesView from '../components/StudyView';
import DatasetView from '../components/DatasetView';
import DatasetCreateView from '../components/DatasetCreateView';

class Private extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '/',
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <BrowserRouter>
          <Container verticalPadding>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Home" component={Link} value="/" to="/" />
                <Tab label="Studies" component={Link} value="/studies" to="/studies" />
                <Tab label="Datasets" component={Link} value="/datasets" to="/datasets" />
              </Tabs>
            </AppBar>
            <Switch>
              <Route exact path="/" component={HomeView} />
              <Route exact path="/studies" component={StudiesView} />
              <Route exact path="/datasets" component={DatasetView} />
              <Route exact path="/datasets/create" component={DatasetCreateView} />
            </Switch>
          </Container>
        </BrowserRouter>
      </Screen>
    );
  }
}

export default Private;
