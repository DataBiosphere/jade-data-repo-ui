import { all, fork } from 'redux-saga/effects';

import app from './app';
import github from './github';
import repository from './repository';

/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(app), fork(github), fork(repository)]);
}
