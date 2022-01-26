// @flow
/**
 * @module Actions/App
 * @desc App Actions
 */

import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { getBillingProfileById } = createActions({
  [ActionTypes.GET_BILLING_PROFILE_BY_ID]: (profile) => profile,
  [ActionTypes.GET_BILLING_PROFILE_BY_ID_SUCCESS]: (profile) => profile,
});

export const { createSnapshot } = createActions({
  [ActionTypes.CREATE_SNAPSHOT]: () => ({}),
  [ActionTypes.CREATE_SNAPSHOT_JOB]: (snapshot) => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (snapshot) => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (snapshot) => snapshot,
});

export const { exportSnapshot } = createActions({
  [ActionTypes.EXPORT_SNAPSHOT]: (snapshotId, snapshotName, terraUrl) => ({
    snapshotId,
    snapshotName,
    terraUrl,
  }),
  [ActionTypes.EXPORT_SNAPSHOT_JOB]: (exportResponse) => exportResponse,
  [ActionTypes.EXPORT_SNAPSHOT_SUCCESS]: (exportResponse) => exportResponse,
  [ActionTypes.EXPORT_SNAPSHOT_FAILURE]: (exportResponse) => exportResponse,
});

export const { getSnapshots } = createActions({
  [ActionTypes.GET_SNAPSHOTS_SUCCESS]: (snapshots) => snapshots,
  [ActionTypes.GET_SNAPSHOTS]: (limit, offset, sort, direction, searchString, datasetIds) => ({
    limit,
    offset,
    sort,
    direction,
    searchString,
    datasetIds,
  }),
});

export const { getSnapshotById } = createActions({
  [ActionTypes.GET_SNAPSHOT_BY_ID]: (snapshot) => snapshot,
  [ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS]: (snapshot) => snapshot,
});

export const { getSnapshotPolicy } = createActions({
  [ActionTypes.GET_SNAPSHOT_POLICY]: (policy) => policy,
  [ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS]: (policy) => policy,
});

export const { addSnapshotPolicyMember } = createActions({
  [ActionTypes.ADD_SNAPSHOT_POLICY_MEMBER]: (snapshotId, user, policy) => ({
    snapshotId,
    user,
    policy,
  }),
});

export const { removeSnapshotPolicyMember } = createActions({
  [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBER]: (snapshotId, user, policy) => ({
    snapshotId,
    user,
    policy,
  }),
});

export const { getDatasets } = createActions({
  [ActionTypes.GET_DATASETS_SUCCESS]: (datasets) => datasets,
  [ActionTypes.GET_DATASETS]: (limit, offset, sort, direction, searchString) => ({
    limit,
    offset,
    sort,
    direction,
    searchString,
  }),
});

export const { getDatasetById } = createActions({
  [ActionTypes.GET_DATASET_BY_ID]: (dataset) => dataset,
  [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (dataset) => dataset,
});

export const { getDatasetPolicy } = createActions({
  [ActionTypes.GET_DATASET_POLICY]: (policy) => policy,
  [ActionTypes.GET_DATASET_POLICY_SUCCESS]: (policy) => policy,
});

export const { getDatasetTablePreview } = createActions({
  [ActionTypes.GET_DATASET_TABLE_PREVIEW]: (dataset, tableName) => ({ dataset, tableName }),
  [ActionTypes.GET_DATASET_TABLE_PREVIEW_SUCCESS]: (_) => _,
});

export const { addCustodianToDataset } = createActions({
  [ActionTypes.ADD_CUSTODIAN_TO_DATASET]: (datasetId, users) => ({
    datasetId,
    users,
  }),
});

export const { removeCustodianFromDataset } = createActions({
  [ActionTypes.REMOVE_CUSTODIAN_FROM_DATASET]: (datasetId, user) => ({
    datasetId,
    user,
  }),
});

export const { getJobById } = createActions({
  [ActionTypes.GET_JOB_BY_ID]: (job) => job,
  [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (job) => job,
});

export const { clearJobId } = createActions({
  [ActionTypes.CLEAR_JOB_ID]: (job) => job,
});

export const { hideAlert } = createActions({
  [ActionTypes.HIDE_ALERT]: (index) => index,
});

export const { runQuery } = createActions({
  [ActionTypes.RUN_QUERY_SUCCESS]: (result) => result,
  [ActionTypes.RUN_QUERY]: (projectId, query, maxResults) => ({
    projectId,
    query,
    maxResults,
  }),
});

export const { pageQuery } = createActions({
  [ActionTypes.PAGE_QUERY]: (pageToken, projectId, jobId, pageSize, location) => ({
    pageToken,
    projectId,
    jobId,
    pageSize,
    location,
  }),
});

export const { applyFilters } = createActions({
  [ActionTypes.APPLY_FILTERS]: (filters, table, dataset) => ({
    filters,
    table,
    dataset,
  }),
});

export const { applySort } = createActions({
  [ActionTypes.APPLY_SORT]: (property, direction) => ({
    property,
    direction,
  }),
});

export const { openSnapshotDialog } = createActions({
  [ActionTypes.OPEN_SNAPSHOT_DIALOG]: (isOpen) => isOpen,
});

export const { countResults } = createActions({
  [ActionTypes.COUNT_RESULTS]: (projectId, query) => ({
    projectId,
    query,
  }),
  [ActionTypes.COUNT_RESULTS_SUCCESS]: (count) => count,
});

export const { snapshotCreateDetails } = createActions({
  [ActionTypes.SNAPSHOT_CREATE_DETAILS]: (name, description, assetName, filterData, dataset) => ({
    name,
    description,
    assetName,
    filterData,
    dataset,
  }),
});

export const { addReadersToSnapshot } = createActions({
  [ActionTypes.ADD_READERS_TO_SNAPSHOT]: (readers) => readers,
});
