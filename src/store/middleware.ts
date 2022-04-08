import createSagaMiddleware from 'redux-saga';

export const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

/* istanbul ignore next */
if (process.env.NODE_ENV === 'development') {
  //eslint-disable-next-line  @typescript-eslint/no-var-requires
  const { createLogger } = require('redux-logger');
  //eslint-disable-next-line  @typescript-eslint/no-var-requires
  const invariant = require('redux-immutable-state-invariant').default;

  middleware.push(invariant());
  middleware.push(createLogger({ collapsed: true }));
}

export default middleware;
