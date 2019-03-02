import { all, fork } from 'redux-saga/effects';

import repository from './repository';

/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(repository)]);
}
