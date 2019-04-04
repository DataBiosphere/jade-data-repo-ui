/**
 * @module Sagas/App
 * @desc App
 */
import { all, put, call, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import moment from 'moment';

import { ActionTypes, STATUS } from 'constants/index';

/**
 * Switch Menu
 *
 * @param {Object} action
 *
 */

export const getToken = state => state.user.token;
export const getTokenExpiration = state => state.user.tokenExpiration;

export function* checkToken() {
  const tokenExpiration = yield select(getTokenExpiration);
  // if this fails, should isAuthenticated be flipped?
  return moment(moment()).isSameOrBefore(parseInt(tokenExpiration, 10));
}

export function* authGet(url) {
  if (yield call(checkToken)) {
    // check expiration time against now
    const token = yield select(getToken);
    return yield call(axios.get, url, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    });
  }
  return false;
}

export function* authPost(url, params) {
  if (yield call(checkToken)) {
    // check expiration time against now
    const token = yield select(getToken);
    return yield call(axios.post, url, params, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    });
  }
  return false;
}

/**
 * Saga poller
 */
function* pollJobWorker(jobId, jobTypeSuccess, jobTypeFailure) {
  try {
    const response = yield call(authGet, '/api/repository/v1/jobs/' + jobId);
    const jobStatus = response.data.job_status;
    if (jobStatus !== STATUS.RUNNING) {
      const resultResponse = yield call(authGet, '/api/repository/v1/jobs/' + jobId + '/result');
      if (jobStatus === 'succeeded' && resultResponse && resultResponse.data) {
        yield put({
          type: jobTypeSuccess,
          payload: { jobResult: resultResponse.data },
        });
      } else {
        yield put({
          type: jobTypeFailure,
          payload: { jobResult: resultResponse.data },
        });
      }
    } else {
      yield put({
        type: ActionTypes.GET_JOB_BY_ID_SUCCESS,
        payload: { status: response.job_status },
      });
      yield call(delay, 1000);
      yield call(pollJobWorker, jobId, jobTypeSuccess, jobTypeFailure);
    }
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      payload: err,
    });
  }
}

/**
 * Datasets.
 */

export function* createDataset({ payload }) {
  try {
    const response = yield call(authPost, '/api/repository/v1/datasets', payload);
    const jobId = response.data.id;
    yield put({
      type: ActionTypes.CREATE_DATASET_JOB,
      payload: { data: response, createdDataset: payload },
    });
    yield call(
      pollJobWorker,
      jobId,
      ActionTypes.CREATE_DATASET_SUCCESS,
      ActionTypes.CREATE_DATASET_FAILURE,
    );
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      payload: err,
    });
  }
}

export function* getDatasets() {
  // TODO: add limit and offset
  try {
    const response = yield call(authGet, '/api/repository/v1/datasets');
    yield put({
      type: ActionTypes.GET_DATASETS_SUCCESS,
      datasets: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      datasets: err,
    });
  }
}

export function* getDatasetById({ payload }) {
  const datasetId = payload;
  try {
    const response = yield call(authGet, '/api/repository/v1/datasets/' + datasetId);
    yield put({
      type: ActionTypes.GET_DATASET_BY_ID_SUCCESS,
      dataset: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      dataset: err,
    });
  }
}

export function* getDatasetPolicy({ payload }) {
  const datasetId = payload;
  try {
    const response = yield call(
      axios.get,
      '/api/repository/v1/datasets/' + datasetId + '/policies',
    );
    yield put({
      type: ActionTypes.GET_DATASET_POLICY_SUCCESS,
      dataset: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      dataset: err,
    });
  }
}

export function* addReaderToDataset({ payload }) {
  const datasetId = payload.datasetId;
  try {
    const response = yield call(
      authGet,
      '/api/repository/v1/datasets/' + datasetId + '/policies/readers/members',
    );
    yield put({
      type: ActionTypes.SET_DATASET_POLICY_SUCCESS,
      dataset: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      dataset: err,
    });
  }
}

/**
 * Studies.
 */

export function* getStudies() {
  try {
    const response = yield call(authGet, '/api/repository/v1/studies');
    yield put({
      type: ActionTypes.GET_STUDIES_SUCCESS,
      studies: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      studies: err,
    });
  }
}

export function* getStudyById({ payload }) {
  const studyId = payload;
  try {
    const response = yield call(authGet, '/api/repository/v1/studies/' + studyId);
    yield put({
      type: ActionTypes.GET_STUDY_BY_ID_SUCCESS,
      study: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.EXCEPTION,
      study: err,
    });
  }
}

/**
 * App Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.CREATE_DATASET, createDataset),
    takeLatest(ActionTypes.GET_DATASETS, getDatasets),
    takeLatest(ActionTypes.GET_DATASET_BY_ID, getDatasetById),
    takeLatest(ActionTypes.GET_DATASET_POLICY, getDatasetPolicy),
    takeLatest(ActionTypes.SET_DATASET_POLICY, addReaderToDataset),
    takeLatest(ActionTypes.GET_STUDIES, getStudies),
    takeLatest(ActionTypes.GET_STUDY_BY_ID, getStudyById),
  ]);
}
