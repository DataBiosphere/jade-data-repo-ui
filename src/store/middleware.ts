import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { createLogger } from 'redux-logger';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';

export const sagaMiddleware = createSagaMiddleware();

const middleware = [sagaMiddleware];

/* istanbul ignore next */
if (import.meta.env.DEV) {
  middleware.push(immutableStateInvariantMiddleware() as SagaMiddleware);
  middleware.push(createLogger({ collapsed: true }) as SagaMiddleware);
}

export default middleware;
