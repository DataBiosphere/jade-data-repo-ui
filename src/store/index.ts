import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import { connectRouter } from 'connected-react-router';

import rootSaga from 'sagas/index';
import rootReducer, { initialTdrState, TdrState } from 'reducers/index';
import history from 'modules/hist';
import { History } from 'history';
import middleware, { sagaMiddleware } from './middleware';

const reducer = (hist: History) =>
  combineReducers({
    router: connectRouter(hist),
    ...rootReducer,
  });

// @ts-ignore
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/* istanbul ignore next */
const configStore = (initialState: TdrState = initialTdrState): Store<TdrState> => {
  const store = createStore(
    reducer(history),
    initialState,
    composeEnhancer(applyMiddleware(...middleware)),
  );

  sagaMiddleware.run(rootSaga);

  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
    module.hot.accept('reducers', () => {
      store.replaceReducer(require('reducers/index').default);
    });
  }

  return store;
};

const store = configStore();

// @ts-ignore
global.store = store;

export { store };
