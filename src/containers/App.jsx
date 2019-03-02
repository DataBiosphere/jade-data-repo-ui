import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import Helmet from 'react-helmet';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

import history from 'modules/history';
import theme from 'modules/theme';

import config from 'config';

import Home from 'routes/Home';
import Private from 'routes/Private';
import NotFound from 'routes/NotFound';

import Header from 'components/Header';

import { logOut } from 'actions/index';
import Footer from 'components/Footer';
import RoutePublic from 'components/RoutePublic';
import RoutePrivate from 'components/RoutePrivate';

const wrapperStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  opacity: '1 !important',
  position: 'relative',
  transition: 'opacity 0.5s',
};

const mainStyle = {
  minHeight: '100vh',
  border: '1px solid blue',
};

export class App extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user, dispatch } = this.props;
    return (
      <Router history={history}>
        <MuiThemeProvider theme={theme}>
          <div style={wrapperStyle}>
            <Helmet
              defer={false}
              htmlAttributes={{ lang: 'pt-br' }}
              encodeSpecialCharacters={true}
              defaultTitle={config.title}
              titleTemplate={`%s | ${config.name}`}
              titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            />
            <Header logOutClicked={() => dispatch(logOut())} user={user} />
            <div style={mainStyle}>
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
            </div>
            <Footer />
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
