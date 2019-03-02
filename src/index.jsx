// Polyfills
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

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
        <AppContainer>
          <Provider store={store}>
            <Helmet
              defer={false}
              htmlAttributes={{ lang: 'pt-br' }}
              encodeSpecialCharacters={true}
              defaultTitle={config.title}
              titleTemplate={`%s | ${config.name}`}
              titleAttributes={{ itemprop: 'name', lang: 'pt-br' }}
            />
            <Component />
          </Provider>
        </AppContainer>,
        root,
      );
    }
  },
};

app.run();

if (module.hot) {
  module.hot.accept('containers/App', () => app.render(App));
}
