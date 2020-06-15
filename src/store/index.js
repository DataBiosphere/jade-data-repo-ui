import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import rootSaga from 'sagas/index';
import rootReducer from 'reducers/index';
import history from 'modules/hist';
import middleware, { sagaMiddleware } from './middleware';

const reducer = (hist) =>
  combineReducers({
    router: connectRouter(hist),
    ...rootReducer,
  });

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const configStore = (initialState = {}) => {
  const store = createStore(
    reducer(history),
    initialState,
    composeEnhancer(applyMiddleware(...middleware)),
  );

  sagaMiddleware.run(rootSaga);

  if (module.hot) {
    module.hot.accept('reducers', () => {
      store.replaceReducer(require('reducers/index').default);
    });
  }

  return {
    store,
  };
};

const { store } = configStore();

global.store = store;

export { store };
