import { all, fork } from 'redux-saga/effects';

import repository from './repository';

/**
 * rootSaga
 */
export default function* root(): any {
  yield all([fork(repository)]);
}
