/**
 * @module Sagas/App
 * @desc App
 */
import { actionChannel, all, fork, put, call, select, take, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import _ from 'lodash';

import { showNotification } from 'modules/notifications';
import { ActionTypes, Status, DbColumns, TABLE_DEFAULT_ROWS_PER_PAGE } from '../constants';
import { TdrState } from '../reducers';

/**
 * Switch Menu
 *
 *
 * @param state
 */

export const getUser = (state: TdrState) => state.user;
export const getToken = (state: TdrState) => state.user.token;
export const getTokenExpiration = (state: TdrState) => state.user.tokenExpiration;
export const getDelegateToken = (state: TdrState) => state.user.delegateToken;
export const getSnapshotState = (state: TdrState) => state.snapshots;
export const getQuery = (state: TdrState) => state.query;
export const getDataset = (state: TdrState) => state.datasets.dataset;
export const getSamUrl = (state: TdrState) => state.configuration.configObject.samUrl;

export const timeoutMsg = 'Your session has timed out. Please refresh the page.';

export function* checkToken() {
  const tokenExpiration: ReturnType<typeof getTokenExpiration> = yield select(getTokenExpiration);
  // if this fails, should isAuthenticated be flipped?
  return moment(moment()).isSameOrBefore(tokenExpiration);
}

function* getTokenToUse(isDelegateToken: boolean) {
  let token: string;
  if (isDelegateToken) {
    token = yield select(getDelegateToken);
  } else {
    token = yield select(getToken);
  }
  return token;
}

export function* authGet(url: string, params = {}, isDelegateToken = false) {
  const tokenIsValid: boolean = yield call(checkToken);
  if (tokenIsValid) {
    // check expiration time against now
    const token: string = yield call(getTokenToUse, isDelegateToken);
    const result: AxiosResponse = yield call(axios.get, url, {
      params,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    return result;
  }
  throw timeoutMsg;
}

export function* authPost(url: string, params = {}, isDelegateToken = false) {
  const tokenIsValid: boolean = yield call(checkToken);
  if (tokenIsValid) {
    // check expiration time against now
    const token: string = yield call(getTokenToUse, isDelegateToken);
    const result: AxiosResponse = yield call(axios.post, url, params, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    return result;
  }
  throw timeoutMsg;
}

export function* authPatch(url: string, params = {}, isDelegateToken = false) {
  const tokenIsValid: boolean = yield call(checkToken);
  if (tokenIsValid) {
    // check expiration time against now
    const token: string = yield call(getTokenToUse, isDelegateToken);
    const result: AxiosResponse = yield call(axios.patch, url, params, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    return result;
  }
  throw timeoutMsg;
}

export function* authDelete(url: string, isDelegateToken = false) {
  const tokenIsValid: boolean = yield call(checkToken);
  if (tokenIsValid) {
    // check expiration time against now
    const token: string = yield call(getTokenToUse, isDelegateToken);
    const result: AxiosResponse = yield call(axios.delete, url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });
    return result;
  }
  throw timeoutMsg;
}

/**
 * Saga poller
 */
function* pollJobWorker(
  jobId: string,
  jobTypeSuccess: string,
  jobTypeFailure: string,
  jobTypeException: string,
): any {
  try {
    const response = yield call(authGet, `/api/repository/v1/jobs/${jobId}`);
    const jobStatus = response.data.job_status;
    if (jobStatus !== Status.RUNNING) {
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
      yield call(pollJobWorker, jobId, jobTypeSuccess, jobTypeFailure, jobTypeException);
    }
  } catch (err) {
    showNotification(err);
    yield put({
      type: jobTypeException,
    });
  }
}

export function* exportSnapshot({ payload }: any): any {
  try {
    yield put({
      type: ActionTypes.EXPORT_SNAPSHOT_START,
    });
    const { snapshotId, exportGsPaths, validatePrimaryKeyUniqueness } = payload;
    const response = yield call(
      authGet,
      `/api/repository/v1/snapshots/${snapshotId}/export?exportGsPaths=${exportGsPaths}&validatePrimaryKeyUniqueness=${validatePrimaryKeyUniqueness}`,
    );
    const jobId = response.data.id;
    yield put({
      type: ActionTypes.EXPORT_SNAPSHOT_JOB,
      payload: { data: response, jobId },
    });
    yield call(
      pollJobWorker,
      jobId,
      ActionTypes.EXPORT_SNAPSHOT_SUCCESS,
      ActionTypes.EXPORT_SNAPSHOT_FAILURE,
      ActionTypes.EXPORT_SNAPSHOT_EXCEPTION,
    );
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.EXPORT_SNAPSHOT_EXCEPTION,
    });
  }
}

export function* resetSnapshotExport() {
  try {
    yield put({
      type: ActionTypes.RESET_SNAPSHOT_EXPORT_DATA,
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.EXPORT_SNAPSHOT_EXCEPTION,
    });
  }
}

/**
 * Snapshots.
 */

export function* createSnapshot(): any {
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
          query: `SELECT ${datasetName}.${rootTable}.${DbColumns.ROW_ID} ${joinStatement} ${filterStatement}`,
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
      ActionTypes.CREATE_SNAPSHOT_EXCEPTION,
    );
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.CREATE_SNAPSHOT_EXCEPTION,
    });
  }
}

export function* getSnapshots({ payload }: any): any {
  const offset = payload.offset || 0;
  const limit = payload.limit || 10;
  const filter = payload.searchString || '';
  const sort = payload.sort || 'created_date';
  const direction = payload.direction || 'desc';
  const datasetIds = payload.datasetIds || [];
  const { successType, failureType } = payload;
  // TODO what's the best way to stringify this? I bet there's a good library:
  let datasetIdsQuery = '';
  datasetIds.map((id: string) => (datasetIdsQuery += `&datasetIds=${id}`));
  const query = `/api/repository/v1/snapshots?offset=${offset}&limit=${limit}&sort=${sort}&direction=${direction}&filter=${filter}`;
  try {
    const response = yield call(authGet, query + datasetIdsQuery);
    yield put({
      type: successType,
      snapshots: { data: response },
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: failureType,
    });
  }
}

export function* patchSnapshotDescription({ payload }: any): any {
  const { snapshotId, text } = payload;
  const data = { description: text };
  const url = `/api/repository/v1/snapshots/${snapshotId}`;
  try {
    yield call(authPatch, url, data);
    yield put({
      type: ActionTypes.PATCH_SNAPSHOT_DESCRIPTION_SUCCESS,
      description: text,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getSnapshotById({ payload }: any): any {
  yield put({
    type: ActionTypes.CHANGE_PAGE,
    payload: 0,
  });
  yield put({
    type: ActionTypes.CHANGE_ROWS_PER_PAGE,
    payload: TABLE_DEFAULT_ROWS_PER_PAGE,
  });
  const { snapshotId, include } = payload;
  const includeUrl = include ? `?${_.map(include, (inc) => `include=${inc}`).join('&')}` : '';
  try {
    const response = yield call(authGet, `/api/repository/v1/snapshots/${snapshotId}${includeUrl}`);
    yield put({
      type: ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS,
      snapshot: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getSnapshotPolicy({ payload }: any): any {
  const snapshotId = payload;
  try {
    const response = yield call(authGet, `/api/repository/v1/snapshots/${snapshotId}/policies`);
    yield put({
      type: ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS,
      snapshot: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_SNAPSHOT_POLICY_FAILURE,
    });
  }
}

export function* addSnapshotPolicyMember({ payload }: any): any {
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
      policy,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* removeSnapshotPolicyMember({ payload }: any): any {
  const { snapshotId, user, policy } = payload;
  const url = `/api/repository/v1/snapshots/${snapshotId}/policies/${policy}/members/${user}`;
  try {
    const response = yield call(authDelete, url);
    yield put({
      type: ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS,
      snapshot: { data: response },
      policy,
    });
  } catch (err) {
    showNotification(err);
  }
}

/**
 * Datasets.
 */

export function* getDatasets({ payload }: any): any {
  const { limit, offset, sort, direction, searchString } = payload;
  try {
    const response = yield call(
      authGet,
      `/api/repository/v1/datasets?offset=${offset}&limit=${limit}&sort=${sort}&direction=${direction}&filter=${searchString}`,
    );
    yield put({
      type: ActionTypes.GET_DATASETS_SUCCESS,
      datasets: { data: response },
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.GET_DATASETS_FAILURE,
    });
  }
}

export function* getDatasetById({ payload }: any): any {
  yield put({
    type: ActionTypes.CHANGE_PAGE,
    payload: 0,
  });
  yield put({
    type: ActionTypes.CHANGE_ROWS_PER_PAGE,
    payload: TABLE_DEFAULT_ROWS_PER_PAGE,
  });
  const { datasetId, include } = payload;
  const includeUrl = include ? `?${_.map(include, (inc) => `include=${inc}`).join('&')}` : '';
  try {
    const response = yield call(authGet, `/api/repository/v1/datasets/${datasetId}${includeUrl}`);
    yield put({
      type: ActionTypes.GET_DATASET_BY_ID_SUCCESS,
      dataset: { data: response },
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getDatasetPolicy({ payload }: any): any {
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

export function* getSamRolesForResource(
  resourceId: string,
  resourceTypeName: string,
  actionType: string,
): any {
  try {
    const response = yield call(
      authGet,
      `/api/repository/v1/${resourceTypeName}/${resourceId}/roles`,
    );
    yield put({
      type: actionType,
      roles: response,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* getUserDatasetRoles({ payload }: any): any {
  const datasetId = payload;
  yield getSamRolesForResource(datasetId, 'datasets', ActionTypes.GET_USER_DATASET_ROLES_SUCCESS);
}

export function* getUserSnapshotRoles({ payload }: any): any {
  const snapshotId = payload;
  yield getSamRolesForResource(
    snapshotId,
    'snapshots',
    ActionTypes.GET_USER_SNAPSHOT_ROLES_SUCCESS,
  );
}

export function* addDatasetPolicyMember({ payload }: any): any {
  const { datasetId, user, policy } = payload;
  const userObject = { email: user };
  try {
    const response = yield call(
      authPost,
      `/api/repository/v1/datasets/${datasetId}/policies/${policy}/members`,
      userObject,
    );
    yield put({
      type: ActionTypes.ADD_DATASET_POLICY_MEMBER_SUCCESS,
      dataset: { data: response },
      policy,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* removeDatasetPolicyMember({ payload }: any): any {
  const { datasetId, user, policy } = payload;
  const url = `/api/repository/v1/datasets/${datasetId}/policies/${policy}/members/${user}`;
  try {
    const response = yield call(authDelete, url);
    yield put({
      type: ActionTypes.REMOVE_DATASET_POLICY_MEMBER_SUCCESS,
      dataset: { data: response },
      policy,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* addCustodianToDataset({ payload }: any): any {
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

export function* removeCustodianFromDataset({ payload }: any): any {
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

export function* getDatasetTablePreview({ payload }: any): any {
  const { dataset, tableName } = payload;
  const datasetProject = dataset.dataProject;
  const datasetBqSnapshotName = `datarepo_${dataset.name}`;
  const url = `/bigquery/v2/projects/${datasetProject}/datasets/${datasetBqSnapshotName}/tables/${tableName}/data`;
  try {
    const response = yield call(authGet, `${url}?maxResults=100`, true);
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
 * billing profile
 */
export function* getBillingProfileById({ payload }: any): any {
  try {
    const { profileId } = payload;
    const response = yield call(authGet, `/api/resources/v1/profiles/${profileId}`);
    yield put({
      type: ActionTypes.GET_BILLING_PROFILE_BY_ID_SUCCESS,
      profile: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_BILLING_PROFILE_BY_ID_EXCEPTION,
    });
  }
}

export function* watchGetDatasetByIdSuccess(): any {
  const requestChan = yield actionChannel(ActionTypes.GET_DATASET_BY_ID_SUCCESS);
  while (true) {
    const { dataset } = yield take(requestChan);
    // Trigger an action to fetch billing profile
    yield put({
      type: ActionTypes.GET_BILLING_PROFILE_BY_ID,
      payload: { profileId: dataset.data.data.defaultProfileId },
    });
  }
}

/**
 * Preview Data
 */

export function* previewData({ payload }: any): any {
  const queryState = yield select(getQuery);
  const offset = queryState.page * queryState.rowsPerPage;
  const limit = queryState.rowsPerPage;
  const sort = queryState.orderProperty === undefined ? '' : `&sort=${queryState.orderProperty}`;
  const sortDirection =
    queryState.orderDirection === undefined ? '' : `&direction=${queryState.orderDirection}`;
  const query = `/api/repository/v1/${payload.resourceType}s/${payload.resourceId}/data/${payload.table}?offset=${offset}&limit=${limit}${sort}${sortDirection}`;
  try {
    const response = yield call(authGet, query);
    yield put({
      type: ActionTypes.PREVIEW_DATA_SUCCESS,
      payload: {
        queryResults: response,
        columns: payload.columns,
        totalRowCount: payload.totalRowCount,
      },
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.PREVIEW_DATA_FAILURE,
      payload: err,
    });
  }
}

/**
 * bigquery
 */

function* pollQuery(projectId: string, jobId: string): any {
  try {
    const url = `/bigquery/v2/projects/${projectId}/queries/${jobId}`;
    const response = yield call(authGet, url, true);
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

export function* runQuery({ payload }: any): any {
  try {
    const url = `/bigquery/v2/projects/${payload.projectId}/queries`;
    const queryState = yield select(getQuery);
    const body = {
      query: payload.query,
      maxResults: queryState.rowsPerPage,
    };
    const response = yield call(authPost, url, body, true);
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

export function* changeRowsPerPage(rowsPerPage: number): any {
  try {
    yield put({
      type: ActionTypes.CHANGE_ROWS_PER_PAGE,
      rowsPerPage,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* changePage(page: number): any {
  try {
    yield put({
      type: ActionTypes.CHANGE_PAGE,
      page,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* pageQuery({ payload }: any): any {
  try {
    const url = `/bigquery/v2/projects/${payload.projectId}/queries/${payload.jobId}`;
    const queryState = yield select(getQuery);
    const params = {
      maxResults: queryState.rowsPerPage,
      pageToken: payload.pageToken,
      location: payload.location,
    };
    const response = yield call(authGet, url, params, true);

    yield put({
      type: ActionTypes.PAGE_QUERY_SUCCESS,
      results: response,
    });
  } catch (err) {
    showNotification(err);
  }
}

export function* countResults({ payload }: any): any {
  try {
    const url = `/bigquery/v2/projects/${payload.projectId}/queries`;
    const body = {
      query: payload.query,
    };
    const response = yield call(authPost, url, body, true);
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

export function* getFeatures(): any {
  try {
    const samUrl = yield select(getSamUrl);
    const url = `${samUrl}/api/groups/v1`;
    const response = yield call(authGet, url);
    yield put({
      type: ActionTypes.GET_FEATURES_SUCCESS,
      groups: response.data,
    });
  } catch (err) {
    //eslint-disable-next-line no-console
    console.warn('Error feature flag information from Sam', err);
  }
}

export function* getUserStatus(): any {
  try {
    yield call(authGet, '/api/repository/v1/register/user');
    yield put({
      type: ActionTypes.GET_USER_STATUS_SUCCESS,
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.GET_USER_STATUS_FAILURE,
    });
  }
}

export function* patchDatasetDescription({ payload }: any): any {
  const { datasetId, text } = payload;
  const data = { description: text };
  const url = `/api/repository/v1/datasets/${datasetId}`;
  try {
    yield call(authPatch, url, data);
    yield put({
      type: ActionTypes.PATCH_DATASET_DESCRIPTION_SUCCESS,
      description: text,
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
    takeLatest(ActionTypes.EXPORT_SNAPSHOT, exportSnapshot),
    takeLatest(ActionTypes.RESET_SNAPSHOT_EXPORT, resetSnapshotExport),
    takeLatest(ActionTypes.GET_SNAPSHOTS, getSnapshots),
    takeLatest(ActionTypes.GET_SNAPSHOT_BY_ID, getSnapshotById),
    takeLatest(ActionTypes.GET_SNAPSHOT_POLICY, getSnapshotPolicy),
    takeLatest(ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER, addSnapshotPolicyMember),
    takeLatest(ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER, removeSnapshotPolicyMember),
    takeLatest(ActionTypes.GET_DATASETS, getDatasets),
    takeLatest(ActionTypes.GET_DATASET_SNAPSHOTS, getSnapshots),
    takeLatest(ActionTypes.GET_DATASET_BY_ID, getDatasetById),
    takeLatest(ActionTypes.GET_DATASET_POLICY, getDatasetPolicy),
    takeLatest(ActionTypes.ADD_CUSTODIAN_TO_DATASET, addCustodianToDataset),
    takeLatest(ActionTypes.REMOVE_CUSTODIAN_FROM_DATASET, removeCustodianFromDataset),
    takeLatest(ActionTypes.ADD_DATASET_POLICY_MEMBER, addDatasetPolicyMember),
    takeLatest(ActionTypes.REMOVE_DATASET_POLICY_MEMBER, removeDatasetPolicyMember),
    takeLatest(ActionTypes.GET_DATASET_TABLE_PREVIEW, getDatasetTablePreview),
    takeLatest(ActionTypes.RUN_QUERY, runQuery),
    takeLatest(ActionTypes.PREVIEW_DATA, previewData),
    takeLatest(ActionTypes.PAGE_QUERY, pageQuery),
    takeLatest(ActionTypes.COUNT_RESULTS, countResults),
    takeLatest(ActionTypes.GET_FEATURES, getFeatures),
    takeLatest(ActionTypes.GET_BILLING_PROFILE_BY_ID, getBillingProfileById),
    takeLatest(ActionTypes.GET_USER_DATASET_ROLES, getUserDatasetRoles),
    takeLatest(ActionTypes.GET_USER_SNAPSHOT_ROLES, getUserSnapshotRoles),
    takeLatest(ActionTypes.GET_USER_STATUS, getUserStatus),
    takeLatest(ActionTypes.PATCH_DATASET_DESCRIPTION, patchDatasetDescription),
    takeLatest(ActionTypes.PATCH_SNAPSHOT_DESCRIPTION, patchSnapshotDescription),
    fork(watchGetDatasetByIdSuccess),
  ]);
}
