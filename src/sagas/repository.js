/**
 * @module Sagas/App
 * @desc App
 */
import { all, put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

import { ActionTypes } from 'constants/index';

/**
 * Switch Menu
 *
 * @param {Object} action
 *
 */
export function* createDataset({ payload }) {
  try {
    const response = yield call(axios.post, '/api/repository/v1/datasets', payload);
    yield put({
      type: ActionTypes.DATASET_CREATE_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      payload: err,
    });
  }
}

export function* enumerateDatasets({ payload }) {
  try {
    const response = yield call(
      axios.get,
      '/api/repository/v1/datasets?offset=0&limit=10',
      payload,
    );
    yield put({
      type: ActionTypes.DATASETS_GET_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
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
  yield all(
    [takeLatest(ActionTypes.CREATE_DATASET, createDataset)],
    [takeLatest(ActionTypes.DATASETS_GET_SUCCESS, enumerateDatasets)],
  );
}
