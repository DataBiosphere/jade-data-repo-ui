// Polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import { Router } from 'react-router-dom';
import history from 'modules/hist';
import globalTheme from 'modules/theme';
import { ThemeProvider } from '@material-ui/styles';

import { store } from 'store/index';

import config from 'config';
import App from 'containers/App';

export const app = {
  cssRetries: 0,
  fetchRetries: 0,

  run() {
    this.render(App);
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
