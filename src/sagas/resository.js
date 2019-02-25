/**
 * @module Sagas/App
 * @desc App
 */
import { all, put, call, takeLatest } from 'redux-saga/effects';

import { request } from 'modules/client';
import { ActionTypes } from 'constants/index';

/**
 * Switch Menu
 *
 * @param {Object} action
 *
 */
export function* createDataset({ payload }) {
  try {
    const response = yield call(request, '/api/repository/v1/datasets', {
      payload,
      method: 'POST',
    });
    yield put({
      type: ActionTypes.DATASET_CREATE_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.EXCEPTION,
      payload: err,
    });
  }
}

/**
 * App Sagas
 */
export default function* root() {
  yield all([takeLatest(ActionTypes.CREATE_DATASET, createDataset)]);
}
