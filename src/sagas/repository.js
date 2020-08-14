/**
 * @module Sagas/App
 * @desc App
 */
import { all, put, call, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { ActionTypes, STATUS } from 'constants/index';
import { showNotification } from 'modules/notifications';

/**
 * Switch Menu
 *
 * @param {Object} action
 *
 */

export const getToken = (state) => state.user.token;
export const getTokenExpiration = (state) => state.user.tokenExpiration;
export const getSnapshotState = (state) => state.snapshots;
export const getQuery = (state) => state.query;
export const getDataset = (state) => state.datasets.dataset;

export const timeoutMsg = 'Your session has timed out. Please refresh the page.';

export function* checkToken() {
  const tokenExpiration = yield select(getTokenExpiration);
  // if this fails, should isAuthenticated be flipped?
  return moment(moment()).isSameOrBefore(parseInt(tokenExpiration, 10));
}

export function* authGet(url, params = {}) {
  if (yield call(checkToken)) {
    // check expiration time against now
    const token = yield select(getToken);
    return yield call(axios.get, url, {
      params,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
  }
  throw timeoutMsg;
}

export function* authPost(url, params) {
  if (yield call(checkToken)) {
    // check expiration time against now
    const token = yield select(getToken);
    return yield call(axios.post, url, params, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
  }
  throw timeoutMsg;
}

export function* authDelete(url) {
  if (yield call(checkToken)) {
    // check expiration time against now
    const token = yield select(getToken);
    return yield call(axios.delete, url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
  }
  throw timeoutMsg;
}

/**
 * Saga poller
 */
function* pollJobWorker(jobId, jobTypeSuccess, jobTypeFailure) {
  try {
    const response = yield call(authGet, `/api/repository/v1/jobs/${jobId}`);
    const jobStatus = response.data.job_status;
    if (jobStatus !== STATUS.RUNNING) {
      const resultResponse = yield call(authGet, `/api/repository/v1/jobs/${jobId}/result`);
      if (jobStatus === 'succeeded' && resultResponse && resultResponse.data) {
        yield put({
          type: jobTypeSuccess,
          payload: { jobId, jobResult: resultResponse.data },
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
        payload: { status: response.data.job_status },
      });
      yield call(delay, 1000);
      yield call(pollJobWorker, jobId, jobTypeSuccess, jobTypeFailure);
    }
  } catch (err) {
    showNotification(err);
  }
}

/**
 * Snapshots.
 */

export function* createSnapshot() {
  const snapshots = yield select(getSnapshotState);
  const dataset = yield select(getDataset);
  const {
    name,
    description,
    assetName,
    filterStatement,
    joinStatement,
    readers,
  } = snapshots.snapshotRequest;

  const datasetName = dataset.name;
  const mode = 'byQuery';
  const selectedAsset = _.find(dataset.schema.assets, (asset) => asset.name === assetName);
  const { rootTable } = selectedAsset;
  const drRowId = 'datarepo_row_id';

  const snapshotRequest = {
    name,
    profileId: dataset.defaultProfileId,
    description,
    readers,
    contents: [
      {
        datasetName,
        mode,
        querySpec: {
          assetName,
          query: `SELECT ${datasetName}.${rootTable}.${drRowId} ${joinStatement} ${filterStatement}`,
        },
      },
    ],
  };
  try {
    const response = yield call(authPost, '/api/repository/v1/snapshots', snapshotRequest);
    const jobId = response.data.id;
    yield put({
      type: ActionTypes.CREATE_SNAPSHOT_JOB,
      payload: { data: response, jobId, snapshotRequest },
    });
    yield call(
      pollJobWorker,
      jobId,
      ActionTypes.CREATE_SNAPSHOT_SUCCESS,
      ActionTypes.CREATE_SNAPSHOT_FAILURE,
    );
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.EXCEPTION,
    });
  }
}

export function* getSnapshots({ payload }) {
  const offset = payload.offset || 0;
  const limit = payload.limit || 10;
  const filter = payload.searchString || '';
  const sort = payload.sort || 'created_date';
  const direction = payload.direction || 'desc';
  try {
    const response = yield call(
      authGet,
      `/api/repository/v1/snapshots?offset=${offset}&limit=${limit}&sort=${sort}&direction=${direction}&filter=${filter}`,
    );
    yield put({
      type: ActionTypes.GET_SNAPSHOTS_SUCCESS,
      snapshots: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getSnapshotById({ payload }) {
  const snapshotId = payload;
  try {
    const response = yield call(authGet, `/api/repository/v1/snapshots/${snapshotId}`);
    yield put({
      type: ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS,
      snapshot: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getSnapshotPolicy({ payload }) {
  const snapshotId = payload;
  try {
    const response = yield call(authGet, `/api/repository/v1/snapshots/${snapshotId}/policies`);
    yield put({
      type: ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS,
      snapshot: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* addSnapshotPolicyMember({ payload }) {
  const { snapshotId, user, policy } = payload;
  const userObject = { email: user };
  try {
    const response = yield call(
      authPost,
      `/api/repository/v1/snapshots/${snapshotId}/policies/${policy}/members`,
      userObject,
    );
    yield put({
      type: ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS,
      snapshot: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* removeReaderFromSnapshot({ payload }) {
  const { snapshotId } = payload;
  const reader = payload.user;
  const url = `/api/repository/v1/snapshots/${snapshotId}/policies/reader/members/${reader}`;
  try {
    const response = yield call(authDelete, url);
    yield put({
      type: ActionTypes.REMOVE_READER_FROM_SNAPSHOT_SUCCESS,
      snapshot: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

/**
 * Datasets.
 */

export function* getDatasets({ payload }) {
  const limit = payload.limit || 10;
  const offset = payload.offset || 0;
  const filter = payload.searchString || '';
  const sort = payload.sort || 'created_date';
  const direction = payload.direction || 'desc';
  try {
    const response = yield call(
      authGet,
      `/api/repository/v1/datasets?offset=${offset}&limit=${limit}&sort=${sort}&direction=${direction}&filter=${filter}`,
    );
    yield put({
      type: ActionTypes.GET_DATASETS_SUCCESS,
      datasets: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getDatasetById({ payload }) {
  const datasetId = payload;
  try {
    const response = yield call(authGet, `/api/repository/v1/datasets/${datasetId}`);
    yield put({
      type: ActionTypes.GET_DATASET_BY_ID_SUCCESS,
      dataset: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getDatasetPolicy({ payload }) {
  const datasetId = payload;
  try {
    const response = yield call(authGet, `/api/repository/v1/datasets/${datasetId}/policies`);
    yield put({
      type: ActionTypes.GET_DATASET_POLICY_SUCCESS,
      policy: response,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* addCustodianToDataset({ payload }) {
  const { datasetId } = payload;
  const custodian = payload.users[0];
  const custodianObject = { email: custodian };
  try {
    const response = yield call(
      authPost,
      `/api/repository/v1/datasets/${datasetId}/policies/custodian/members`, // TODO what is this?
      custodianObject,
    );
    yield put({
      type: ActionTypes.ADD_CUSTODIAN_TO_DATASET_SUCCESS,
      policy: response,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* removeCustodianFromDataset({ payload }) {
  const { datasetId } = payload;
  const custodian = payload.user;
  const url = `/api/repository/v1/datasets/${datasetId}/policies/custodian/members/${custodian}`;
  try {
    const response = yield call(authDelete, url);
    yield put({
      type: ActionTypes.REMOVE_CUSTODIAN_FROM_DATASET_SUCCESS,
      policy: response,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getDatasetTablePreview({ payload }) {
  const { dataset, tableName } = payload;
  const datasetProject = dataset.dataProject;
  const datasetBqSnapshotName = `datarepo_${dataset.name}`;
  const bqApi = 'https://www.googleapis.com/bigquery/v2';
  const url = `${bqApi}/projects/${datasetProject}/datasets/${datasetBqSnapshotName}/tables/${tableName}/data`;
  try {
    const response = yield call(authGet, `${url}?maxResults=100`);
    yield put({
      type: ActionTypes.GET_DATASET_TABLE_PREVIEW_SUCCESS,
      preview: response,
      tableName,
    });
  } catch (err) {
    showNotification(err);
  }
}

/**
 * bigquery
 */

function* pollQuery(projectId, jobId) {
  try {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${projectId}/queries/${jobId}`;
    const response = yield call(authGet, url);
    const { jobComplete } = response.data;
    if (jobComplete) {
      yield put({
        type: ActionTypes.RUN_QUERY_SUCCESS,
        results: response,
      });
    } else {
      yield call(delay, 100);
      yield call(pollQuery, projectId, jobId);
    }
  } catch (err) {
    showNotification(err);
  }
}

export function* runQuery({ payload }) {
  try {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${payload.projectId}/queries`;
    const body = {
      query: payload.query,
      maxResults: payload.maxResults,
    };
    const response = yield call(authPost, url, body);
    const { jobComplete } = response.data;
    const { jobId } = response.data.jobReference;
    if (jobComplete) {
      yield put({
        type: ActionTypes.RUN_QUERY_SUCCESS,
        results: response,
      });
    } else {
      yield put({
        type: ActionTypes.POLL_QUERY,
      });
      yield call(delay, 100);
      yield call(pollQuery, payload.projectId, jobId);
    }
  } catch (err) {
    showNotification(err);
  }
}

export function* pageQuery({ payload }) {
  try {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${payload.projectId}/queries/${payload.jobId}`;
    const params = {
      maxResults: payload.pageSize,
      pageToken: payload.pageToken,
    };
    const response = yield call(authGet, url, params);

    yield put({
      type: ActionTypes.PAGE_QUERY_SUCCESS,
      results: response,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* countResults({ payload }) {
  try {
    const url = `https://bigquery.googleapis.com/bigquery/v2/projects/${payload.projectId}/queries`;
    const body = {
      query: payload.query,
    };
    const response = yield call(authPost, url, body);
    const { jobComplete } = response.data;
    const { jobId } = response.data.jobReference;
    if (jobComplete) {
      yield put({
        type: ActionTypes.COUNT_RESULTS_SUCCESS,
        resultsCount: parseInt(response.data.rows[0].f[0].v, 10),
      });
    } else {
      yield call(delay, 100);
      yield call(pollQuery, payload.projectId, jobId);
    }
  } catch (err) {
    showNotification(err);
  }
}

/**
 * feature flag stuff
 */

export function* getFeatures() {
  try {
    const url = 'https://sam.dsde-dev.broadinstitute.org/api/groups/v1';
    const response = yield call(authGet, url);
    yield put({
      type: ActionTypes.GET_FEATURES_SUCCESS,
      groups: response.data,
    });
  } catch (err) {
    showNotification(err);
  }
}

/**
 * App Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.CREATE_SNAPSHOT, createSnapshot),
    takeLatest(ActionTypes.GET_SNAPSHOTS, getSnapshots),
    takeLatest(ActionTypes.GET_SNAPSHOT_BY_ID, getSnapshotById),
    takeLatest(ActionTypes.GET_SNAPSHOT_POLICY, getSnapshotPolicy),
    takeLatest(ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER, addSnapshotPolicyMember),
    takeLatest(ActionTypes.REMOVE_READER_FROM_SNAPSHOT, removeReaderFromSnapshot),
    takeLatest(ActionTypes.GET_DATASETS, getDatasets),
    takeLatest(ActionTypes.GET_DATASET_BY_ID, getDatasetById),
    takeLatest(ActionTypes.GET_DATASET_POLICY, getDatasetPolicy),
    takeLatest(ActionTypes.ADD_CUSTODIAN_TO_DATASET, addCustodianToDataset),
    takeLatest(ActionTypes.REMOVE_CUSTODIAN_FROM_DATASET, removeCustodianFromDataset),
    takeLatest(ActionTypes.GET_DATASET_TABLE_PREVIEW, getDatasetTablePreview),
    takeLatest(ActionTypes.RUN_QUERY, runQuery),
    takeLatest(ActionTypes.PAGE_QUERY, pageQuery),
    takeLatest(ActionTypes.COUNT_RESULTS, countResults),
    takeLatest(ActionTypes.GET_FEATURES, getFeatures),
  ]);
}
