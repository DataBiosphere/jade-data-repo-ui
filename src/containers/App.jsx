import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import { MuiThemeProvider } from '@material-ui/core/styles';

import history from 'modules/history';
import theme from 'modules/theme';

import config from 'config';

import Home from 'routes/Home';
import Private from 'routes/Private';
import NotFound from 'routes/NotFound';

import Header from 'components/Header';

import Footer from 'components/Footer';
import GlobalStyles from 'components/GlobalStyles';
import RoutePublic from 'components/RoutePublic';
import RoutePrivate from 'components/RoutePrivate';

const AppWrapper = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      opacity: '1 !important',
      position: 'relative',
      transition: 'opacity 0.5s',
    }}
  />
)

const Main = () => <main style={{ minHeight: '100vh' }} />

export class App extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    const { dispatch, user } = this.props;

    return (
      <Router history={history}>
        <MuiThemeProvider theme={theme}>
          <AppWrapper logged={user.isAuthenticated}>
            <Helmet
              defer={false}
              htmlAttributes={{ lang: 'pt-br' }}
              encodeSpecialCharacters={true}
              defaultTitle={config.title}
              titleTemplate={`%s | ${config.name}`}
              titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            />
            <Header dispatch={dispatch} user={user} />
            <Main isAuthenticated={user.isAuthenticated}>
              <Switch>
                <RoutePublic
                  isAuthenticated={user.isAuthenticated}
                  path="/login"
                  exact
                  component={Home}
                />
                <RoutePrivate isAuthenticated={user.isAuthenticated} path="/" component={Private} />
                <Route component={NotFound} />
              </Switch>
            </Main>
            <Footer />
            <GlobalStyles />
          </AppWrapper>
        </MuiThemeProvider>
      </Router>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
