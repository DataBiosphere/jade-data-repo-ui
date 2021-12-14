// Polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { getUser } from 'modules/auth';
import history from 'modules/hist';
import globalTheme from 'modules/theme';
import { ThemeProvider } from '@material-ui/styles';
import axios from 'axios';
import { logIn, getFeatures, logOut } from 'actions/index';
import { ActionTypes } from 'constants/index';

import { store } from 'store/index';

import config from 'config';
import App from 'containers/App';

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
    // 2. grab the configuration + load Google's auth2 library (in parallel)
    // 3. get the client id out of the config and use it to logIn
    // 4. put the config and user details into the store
    // 5. render
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
            getUser({ client_id: configData.clientId })
              .then((user) => {
                if (user != null) {
                  store.dispatch(
                    logIn(
                      user.name,
                      user.imageUrl,
                      user.email,
                      user.accessToken,
                      user.accessTokenExpiration,
                      user.id,
                    ),
                  );
                  store.dispatch(getFeatures());
                } else {
                  store.dispatch(logOut());
                }
                resolve();
              })
              .catch(reject);
          })
          .catch(reject);
        resolve();
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
          <ThemeProvider theme={globalTheme}>
            <Component />
          </ThemeProvider>
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
    console.error(err);
  });
