/* eslint-disable import/no-import-module-exports */
import { applyMiddleware, combineReducers, compose, legacy_createStore, Store } from 'redux';
import { connectRouter } from 'connected-react-router';

import { History } from 'history';
import rootSaga from 'sagas/index';
import history from 'modules/hist';
import rootReducer, { initialTdrState, TdrState } from 'reducers/index';
import middleware, { sagaMiddleware } from './middleware';
/* eslint-enable import/no-import-module-exports */

const reducer = (hist: History) =>
  combineReducers({
    router: connectRouter(hist),
    ...rootReducer,
  });

// @ts-ignore
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const configStore = (initialState: TdrState = initialTdrState): Store<TdrState> => {
  const store = legacy_createStore(
    reducer(history),
    initialState,
    composeEnhancer(applyMiddleware(...middleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

const store = configStore();

// @ts-ignore
global.store = store;

export { store };
export type AppDispatch = typeof store.dispatch;
