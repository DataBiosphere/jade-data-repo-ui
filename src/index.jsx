// Polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import globalTheme from 'modules/theme';
import { ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { WebStorageStateStore, Log } from 'oidc-client-ts';
import { AuthProvider } from 'react-oidc-context';
// For some reason, @emotion package doesn't register with linter.  Ignoring for now
//eslint-disable-next-line import/no-extraneous-dependencies
import createCache from '@emotion/cache';
//eslint-disable-next-line import/no-extraneous-dependencies
import { CacheProvider } from '@emotion/react';

import config from 'config';
import App from 'containers/App';

import { ActionTypes } from './constants';
import { store } from './store';

const cache = createCache({
  key: 'css',
  prepend: false,
});

function checkStatus() {
  return new Promise((resolve, reject) => {
    axios
      .get('/status')
      .then((response) => {
        resolve(response);
      })
      .catch(reject);
  });
}

function getConfig() {
  return new Promise((resolve, reject) => {
    axios
      .get('/configuration')
      .then((response) => {
        resolve(response.data);
      })
      .catch(reject);
  });
}

function bootstrap() {
  return new Promise((resolve, reject) => {
    // We need to do this (in order) before bothering to render:
    // 1. Check status of the server
    // 2. Get the client id and put the config into the store
    // 3. render
    checkStatus()
      .then((response) => {
        store.dispatch({
          type: ActionTypes.GET_SERVER_STATUS_SUCCESS,
          status: {
            tdrOperational: true,
            apiIsUp: true,
            serverStatus: response.data,
          },
        });
        getConfig()
          .then((configData) => {
            store.dispatch({
              type: ActionTypes.GET_CONFIGURATION_SUCCESS,
              configuration: configData,
            });
            resolve();
          })
          .catch(reject);
      })
      .catch((error) => {
        // The API returns a 503 UNAVAILABLE from the  '/status' endpoint if dependencies are down.
        if (error.response === undefined || error.response.status !== 503) {
          store.dispatch({
            type: ActionTypes.GET_SERVER_STATUS_DOWN,
            status: {
              tdrOperational: false,
              apiIsUp: false,
            },
          });
        } else {
          store.dispatch({
            type: ActionTypes.GET_SERVER_STATUS_FAILURE,
            status: {
              tdrOperational: false,
              apiIsUp: true,
              serverStatus: error.response.data,
            },
          });
        }
        resolve();
      });
  });
}

function render(Component) {
  const root = document.getElementById('react');
  const { configuration } = store.getState();
  const isGoogleAuthority = configuration.configObject.authorityEndpoint.startsWith(
    'https://accounts.google.com',
  );
  const metadata = {
    authorization_endpoint: `${window.origin}/oauth2/authorize`,
    token_endpoint: `${window.origin}/oauth2/token`,
  };

  const scopes = ['openid', 'email', 'profile'];
  if (isGoogleAuthority) {
    // TODO once we no longer query BQ directly, we'll no longer need the BQ scope
    scopes.push('https://www.googleapis.com/auth/bigquery.readonly');
    scopes.push('https://www.googleapis.com/auth/drive.file');

    metadata.userinfo_endpoint = 'https://openidconnect.googleapis.com/v1/userinfo';
  }
  const oidcConfig = {
    authority: configuration.configObject.authorityEndpoint,
    client_id: configuration.configObject.oidcClientId,
    // overwrite the auth endpoint to use the one hosted by TDR
    metadata,
    redirect_uri: `${window.origin}/redirect-from-oauth`,
    prompt: 'login',
    scope: scopes.join(' '),
    loadUserInfo: isGoogleAuthority,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    extraQueryParams: { access_type: 'offline' },
  };

  // Log oauth client events.  Do no check in code where this gets set higher since we won't want
  // to accidentally log tokens
  Log.setLevel(Log.WARN);
  Log.setLogger(console);

  if (root) {
    ReactDOM.render(
      <Provider store={store}>
        <Helmet
          defer={false}
          htmlAttributes={{ lang: 'en-us' }}
          encodeSpecialCharacters={true}
          defaultTitle={'Terra Data Repository' || config.title}
          titleTemplate={`%s | ${config.name}`}
          titleAttributes={{ itemprop: 'name', lang: 'en-us' }}
        />
        <Router history={history}>
          {/* CachingProvider is a way to control how css is rendered in the DOM */}
          <CacheProvider value={cache}>
            <ThemeProvider theme={globalTheme}>
              <AuthProvider {...oidcConfig}>
                <Component />
              </AuthProvider>
            </ThemeProvider>
          </CacheProvider>
        </Router>
      </Provider>,
      root,
    );
    if (window.Cypress) {
      window.store = store;
    }
  }
}

bootstrap()
  .then(() => render(App))
  .catch((err) => {
    // TODO: display in UI
    //eslint-disable-next-line no-console
    console.error(err);
  });
