/**
 * @module Sagas/App
 * @desc App
 */
import {
  actionChannel,
  all,
  fork,
  put,
  call,
  select,
  take,
  takeLatest,
  takeEvery,
  delay,
} from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import _ from 'lodash';
import { RouterRootState } from 'connected-react-router';

import { showNotification } from 'modules/notifications';
import { JobModelJobStatusEnum, SqlSortDirection } from 'generated/tdr';
import {
  ActionTypes,
  Status,
  DbColumns,
  TABLE_DEFAULT_ROWS_PER_PAGE,
  ColumnStatsRetrievalType,
} from 'constants';
import { TdrState } from 'reducers';

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
export const getDuosUrl = (state: TdrState) => state.configuration.configObject.duosUrl;
export const getLocation = (state: TdrState & RouterRootState) => state.router.location;
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

export function* authPut(url: string, params = {}, isDelegateToken = false) {
  const tokenIsValid: boolean = yield call(checkToken);
  if (tokenIsValid) {
    // check expiration time against now
    const token: string = yield call(getTokenToUse, isDelegateToken);
    const result: AxiosResponse = yield call(axios.put, url, params, {
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
      yield delay(1000);
      yield call(pollJobWorker, jobId, jobTypeSuccess, jobTypeFailure, jobTypeException);
    }
  } catch (err) {
    showNotification(err, jobId);
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
    policies,
  } = snapshots.snapshotRequest;

  const datasetName = dataset.name;
  const mode = 'byQuery';
  const selectedAsset = _.find(dataset.schema.assets, (asset) => asset.name === assetName);

  const { rootTable } = selectedAsset;

  const snapshotRequest = {
    name,
    profileId: dataset.defaultProfileId,
    description,
    policies,
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

export function* patchSnapshot({ payload }: any): any {
  const { snapshotId, data } = payload;
  const url = `/api/repository/v1/snapshots/${snapshotId}`;
  try {
    yield put({
      type: ActionTypes.PATCH_SNAPSHOT_START,
      data,
    });
    yield call(authPatch, url, data);
    yield put({
      type: ActionTypes.PATCH_SNAPSHOT_SUCCESS,
      data,
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.PATCH_SNAPSHOT_FAILURE,
      data,
    });
  }
}

export function* updateDuosDataset({ payload }: any): any {
  const { snapshotId, duosId } = payload;
  const baseUrl = `/api/repository/v1/snapshots/${snapshotId}`;
  try {
    yield put({
      type: ActionTypes.UPDATE_DUOS_DATASET_START,
    });
    let response;
    if (duosId) {
      response = yield call(authPut, `${baseUrl}/linkDuosDataset/${duosId}`);
    } else {
      response = yield call(authDelete, `${baseUrl}/unlinkDuosDataset`);
    }
    yield put({
      type: ActionTypes.UPDATE_DUOS_DATASET_SUCCESS,
      duosFirecloudGroup: response.data.linked,
    });
    // Snapshot readers may change as a result of a successful DUOS update:
    yield put({
      type: ActionTypes.GET_SNAPSHOT_POLICY,
      payload: snapshotId,
    });
  } catch (err) {
    showNotification(err);
    yield put({ type: ActionTypes.UPDATE_DUOS_DATASET_FAILURE });
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
    yield put({
      type: ActionTypes.GET_SNAPSHOT_BY_ID_FAILURE,
    });
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
  const location = yield select(getLocation);
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
    // Reload snapshots to get latest state
    if (location.pathname === '/snapshots') {
      yield put({
        type: ActionTypes.REFRESH_SNAPSHOTS,
      });
    }
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_FAILURE,
    });
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
    yield put({
      type: ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER_FAILURE,
    });
  }
}

export function* removeSnapshotPolicyMembers({ payload }: any): any {
  const { snapshotId, users, policy } = payload;
  const urls = users.map(
    (user: string) =>
      `/api/repository/v1/snapshots/${snapshotId}/policies/${policy}/members/${user}`,
  );
  try {
    yield all(urls.map((url: string) => call(authDelete, url)));
    yield put({
      type: ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBERS_SUCCESS,
    });
    yield put({
      type: ActionTypes.GET_SNAPSHOT_POLICY,
      payload: snapshotId,
    });
  } catch (err) {
    showNotification('An error occurred.  Please try removing the workspace again.');
    yield put({
      type: ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBERS_EXCEPTION,
    });
  }
}

/**
 * Datasets.
 */
export function* createDataset({ payload }: any): any {
  try {
    const response = yield call(authPost, '/api/repository/v1/datasets', payload);
    const jobId = response.data.id;
    yield put({
      type: ActionTypes.CREATE_DATASET_JOB,
      payload: { data: response, jobId, payload },
    });
    yield call(
      pollJobWorker,
      jobId,
      ActionTypes.CREATE_DATASET_SUCCESS,
      ActionTypes.CREATE_DATASET_FAILURE,
      ActionTypes.CREATE_DATASET_EXCEPTION,
    );
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.CREATE_DATASET_EXCEPTION,
    });
  }
}

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
    yield put({
      type: ActionTypes.GET_DATASET_BY_ID_FAILURE,
    });
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
  const location = yield select(getLocation);
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
    // Reload datasets to get latest state
    if (location.pathname === '/datasets') {
      yield put({
        type: ActionTypes.REFRESH_DATASETS,
      });
    }
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.ADD_DATASET_POLICY_MEMBER_FAILURE,
    });
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
    yield put({
      type: ActionTypes.REMOVE_DATASET_POLICY_MEMBER_FAILURE,
    });
  }
}

/**
 * Jobs.
 */

export function* getJobs({ payload }: any): any {
  const { limit, offset, sort, direction, searchString } = payload;
  try {
    const response = yield call(
      authGet,
      `/api/repository/v1/jobs?offset=${offset}&limit=${limit}&sort=${sort}&direction=${direction}&filter=${searchString}`,
    );
    yield put({
      type: ActionTypes.GET_JOBS_SUCCESS,
      jobs: { data: response },
    });
  } catch (err) {
    const { errMessage } = payload;
    showNotification(errMessage || err);
    yield put({
      type: ActionTypes.GET_JOBS_FAILURE,
    });
  }
}

/**
 * Get a single result
 */
export function* getJobResult({ payload }: any): any {
  const { id } = payload;
  try {
    const response = yield call(authGet, `/api/repository/v1/jobs/${id}`);
    const jobStatus = response.data.job_status;
    if (jobStatus !== Status.RUNNING) {
      let resultResponse;
      try {
        resultResponse = yield call(authGet, `/api/repository/v1/jobs/${id}/result`);
        yield put({
          type: ActionTypes.GET_JOB_RESULT_SUCCESS,
          payload: {
            data: {
              id,
              jobResult: {
                resultType: JobModelJobStatusEnum.Succeeded,
                result: resultResponse.data,
                jobInfo: response.data,
              },
            },
          },
        });
      } catch (err: any) {
        if (err.response) {
          yield put({
            type: ActionTypes.GET_JOB_RESULT_SUCCESS,
            payload: {
              data: {
                jobResult: {
                  resultType: JobModelJobStatusEnum.Failed,
                  result: {
                    message:
                      _.get(err.response, 'data.message') ??
                      _.get(err.response, 'data.error.message'),
                    detail: _.get(err.response, 'data.errorDetail'),
                  },
                  jobInfo: response.data,
                },
              },
            },
          });
        } else {
          throw err;
        }
      }
    } else {
      yield put({
        type: ActionTypes.GET_JOB_BY_ID_SUCCESS,
        payload: { status: response.data.job_status },
      });
    }
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.GET_JOB_RESULT_FAILURE,
    });
  }
}

/**
 * Journals.
 */

export function* getJournalEntries({ payload }: any): any {
  const { id, resourceType, limit, offset } = payload;
  try {
    const response = yield call(
      authGet,
      `/api/repository/v1/journal/${id}?offset=${offset}&limit=${limit}&resourceType=${resourceType}`,
    );
    yield put({
      type: ActionTypes.GET_JOURNAL_ENTRIES_SUCCESS,
      journalEntries: { data: response },
    });
  } catch (err) {
    const { errMessage } = payload;
    showNotification(errMessage || err);
    yield put({
      type: ActionTypes.GET_JOURNAL_ENTRIES_FAILURE,
    });
  }
}

/**
 * billing profile
 */
export function* getBillingProfiles({ payload }: any): any {
  try {
    const { offset, limit } = payload;
    const response = yield call(
      authGet,
      `/api/resources/v1/profiles?offset=${offset || 0}&limit=${limit || 1000}`,
    );
    yield put({
      type: ActionTypes.GET_BILLING_PROFILES_SUCCESS,
      profile: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_BILLING_PROFILES_FAILURE,
    });
  }
}

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
  const queryDataRequest = {
    offset: queryState.page * queryState.rowsPerPage,
    limit: queryState.rowsPerPage,
    sort: _.isEmpty(queryState.orderProperty) ? DbColumns.ROW_ID : `${queryState.orderProperty}`,
    direction: _.isEmpty(queryState.orderDirection)
      ? SqlSortDirection.Asc
      : `${queryState.orderDirection}`,
    filter: _.isEmpty(queryState.filterStatement) ? '' : `${queryState.filterStatement}`,
  };
  const query = `/api/repository/v1/${payload.resourceType}s/${payload.resourceId}/data/${payload.table}`;
  try {
    const response = yield call(authPost, query, queryDataRequest);
    yield put({
      type: ActionTypes.PREVIEW_DATA_SUCCESS,
      payload: {
        queryResults: response,
        columns: payload.columns,
        totalRowCount: payload.totalRowCount,
        cloudPlatform: payload.cloudPlatform,
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
 * Column Stats
 */

export function* getColumnStats({ payload }: any): any {
  const { columnName, resourceId, resourceType, tableName, columnStatsRetrievalType } = payload;
  const baseQuery = `/api/repository/v1/${resourceType}s/${resourceId}/data/${tableName}/statistics/${columnName}`;
  const queryState = yield select(getQuery);
  const { filterStatement } = queryState;
  const filter = _.isEmpty(filterStatement) ? '' : filterStatement;
  try {
    switch (columnStatsRetrievalType) {
      case ColumnStatsRetrievalType.RETRIEVE_ALL_TEXT: {
        const response = yield call(authPost, baseQuery);
        yield put({
          type: ActionTypes.COLUMN_STATS_TEXT_SUCCESS,
          payload: {
            queryResults: response,
            columnName,
          },
        });
        break;
      }
      case ColumnStatsRetrievalType.RETRIEVE_ALL_NUMERIC: {
        const numericResponse = yield call(authPost, baseQuery);
        yield put({
          type: ActionTypes.COLUMN_STATS_NUMERIC_SUCCESS,
          payload: {
            queryResults: numericResponse,
            columnName,
          },
        });
        break;
      }
      case ColumnStatsRetrievalType.RETRIEVE_FILTERED_TEXT: {
        const filteredResponse = yield call(authPost, baseQuery, { filter });
        yield put({
          type: ActionTypes.COLUMN_STATS_FILTERED_TEXT_SUCCESS,
          payload: {
            queryResults: filteredResponse,
            columnName,
          },
        });
        break;
      }
      case ColumnStatsRetrievalType.RETRIEVE_ALL_AND_FILTERED_TEXT: {
        const payloads = ['', filterStatement];
        const responses = yield all(payloads.map((p) => call(authPost, baseQuery, { filter: p })));
        yield put({
          type: ActionTypes.COLUMN_STATS_ALL_AND_FILTERED_TEXT_SUCCESS,
          payload: {
            queryResults: responses[0],
            filteredQueryResults: responses[1],
            columnName,
          },
        });
        break;
      }
      default: {
        showNotification('ERROR: Invalid column data type category');
      }
    }
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.COLUMN_STATS_FAILURE,
      payload: {
        err,
        columnName,
      },
    });
  }
}

/**
 * bigquery
 */

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

/**
 * DUOS
 */
export function* getDuosDatasets(): any {
  try {
    const duosUrl = yield select(getDuosUrl);
    const url = `${duosUrl}/api/dataset/v2`;
    const response = yield call(authGet, url);
    yield put({
      type: ActionTypes.GET_DUOS_DATASETS_SUCCESS,
      datasets: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_DUOS_DATASETS_FAILURE,
    });
    // Don't throw an error since it is entirely appropriate for a user to not have access to DUOS
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

export function* patchDataset({ payload }: any): any {
  const { datasetId, data } = payload;
  const url = `/api/repository/v1/datasets/${datasetId}`;
  try {
    yield put({
      type: ActionTypes.PATCH_DATASET_START,
      data,
    });
    yield call(authPatch, url, data);
    yield put({
      type: ActionTypes.PATCH_DATASET_SUCCESS,
      data,
    });
  } catch (err) {
    showNotification(err);
    yield put({
      type: ActionTypes.PATCH_DATASET_FAILURE,
      data,
    });
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
    takeLatest(ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBERS, removeSnapshotPolicyMembers),
    takeLatest(ActionTypes.GET_DATASETS, getDatasets),
    takeLatest(ActionTypes.GET_DATASET_SNAPSHOTS, getSnapshots),
    takeLatest(ActionTypes.GET_DATASET_BY_ID, getDatasetById),
    takeLatest(ActionTypes.GET_DATASET_POLICY, getDatasetPolicy),
    takeLatest(ActionTypes.ADD_DATASET_POLICY_MEMBER, addDatasetPolicyMember),
    takeLatest(ActionTypes.REMOVE_DATASET_POLICY_MEMBER, removeDatasetPolicyMember),
    takeLatest(ActionTypes.CREATE_DATASET, createDataset),
    takeLatest(ActionTypes.GET_JOBS, getJobs),
    takeLatest(ActionTypes.GET_JOB_RESULT, getJobResult),
    takeLatest(ActionTypes.GET_JOURNAL_ENTRIES, getJournalEntries),
    takeLatest(ActionTypes.PREVIEW_DATA, previewData),
    takeLatest(ActionTypes.GET_FEATURES, getFeatures),
    takeEvery(ActionTypes.GET_COLUMN_STATS, getColumnStats),
    takeLatest(ActionTypes.GET_BILLING_PROFILES, getBillingProfiles),
    takeLatest(ActionTypes.GET_BILLING_PROFILE_BY_ID, getBillingProfileById),
    takeLatest(ActionTypes.GET_USER_DATASET_ROLES, getUserDatasetRoles),
    takeLatest(ActionTypes.GET_USER_SNAPSHOT_ROLES, getUserSnapshotRoles),
    takeLatest(ActionTypes.GET_USER_STATUS, getUserStatus),
    takeLatest(ActionTypes.PATCH_DATASET, patchDataset),
    takeLatest(ActionTypes.PATCH_SNAPSHOT, patchSnapshot),
    takeLatest(ActionTypes.UPDATE_DUOS_DATASET, updateDuosDataset),
    takeLatest(ActionTypes.GET_DUOS_DATASETS, getDuosDatasets),
    fork(watchGetDatasetByIdSuccess),
  ]);
}
