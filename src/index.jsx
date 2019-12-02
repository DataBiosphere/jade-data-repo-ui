// Polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import globalTheme from 'modules/theme';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';
import { logIn } from 'actions/index';
import { ActionTypes } from 'constants/index';

import { store } from 'store/index';

import config from 'config';
import App from 'containers/App';

function getConfig() {
  return axios.get('/configuration');
}

function loadAuth2() {
  // TODO: add a timeout and handle bad paths
  return new Promise((resolve /* , reject*/) => {
    window.gapi.load('auth2', resolve);
  });
}

export const app = {
  cssRetries: 0,
  fetchRetries: 0,

  run() {
    // We need to do this (in order) before bothering to render:
    // 1. grab the configuration + load Google's auth2 library (in parallel)
    // 2. get the client id out of the config and use it to logIn
    // 3. put the config and user details into the store
    // 4. render

    // TODO: handle errors!
    Promise.all([getConfig(), loadAuth2()]).then(responses => {
      const configData = responses[0].data;
      store.dispatch({
        type: ActionTypes.GET_CONFIGURATION_SUCCESS,
        configuration: configData,
      });
      const { clientId } = configData;

      window.gapi.auth2.init({ clientId }).then(GoogleAuth => {
        const user = GoogleAuth.currentUser.get();
        if (user.isSignedIn()) {
          const profile = user.getBasicProfile();
          const authResponse = user.getAuthResponse(true);
          store.dispatch(
            logIn(
              profile.getName(),
              profile.getImageUrl(),
              profile.getEmail(),
              authResponse.access_token,
              authResponse.expires_at,
            ),
          );
        }
        this.render(App);
      });
    });
  },

  render(Component) {
    const root = document.getElementById('react');

    if (root) {
      ReactDOM.render(
        <Provider store={store}>
          <Helmet
            defer={false}
            htmlAttributes={{ lang: 'pt-br' }}
            encodeSpecialCharacters={true}
            defaultTitle={'Terra Data Repository' || config.title}
            titleTemplate={`%s | ${config.name}`}
            titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
          />
          <Router history={history}>
            <ThemeProvider theme={globalTheme}>
              <Component />
            </ThemeProvider>
          </Router>
        </Provider>,
        root,
      );
    }
  },
};

app.run();
