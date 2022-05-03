import { all, fork } from 'redux-saga/effects';

import repository from './repository';
import auth from './auth';

/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(repository), fork(auth)]);
}
