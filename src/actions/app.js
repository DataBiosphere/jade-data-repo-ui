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
  [ActionTypes.GET_BILLING_PROFILE_BY_ID_EXCEPTION]: () => ({}),
});

export const { createSnapshot } = createActions({
  [ActionTypes.CREATE_SNAPSHOT]: () => ({}),
  [ActionTypes.CREATE_SNAPSHOT_JOB]: (snapshot) => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (snapshot) => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (snapshot) => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_EXCEPTION]: () => ({}),
});

export const { exportSnapshot } = createActions({
  [ActionTypes.EXPORT_SNAPSHOT]: (snapshotId, exportGsPaths, validatePrimaryKeyUniqueness) => ({
    snapshotId,
    exportGsPaths,
    validatePrimaryKeyUniqueness,
  }),
  [ActionTypes.EXPORT_SNAPSHOT_START]: () => ({}),
  [ActionTypes.EXPORT_SNAPSHOT_JOB]: (exportResponse) => exportResponse,
  [ActionTypes.EXPORT_SNAPSHOT_SUCCESS]: (exportResponse) => exportResponse,
  [ActionTypes.EXPORT_SNAPSHOT_FAILURE]: (exportResponse) => exportResponse,
  [ActionTypes.EXPORT_SNAPSHOT_EXCEPTION]: () => ({}),
});

export const { resetSnapshotExport } = createActions({
  [ActionTypes.RESET_SNAPSHOT_EXPORT]: () => ({}),
  [ActionTypes.RESET_SNAPSHOT_EXPORT_DATA]: () => ({}),
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
    successType: ActionTypes.GET_SNAPSHOTS_SUCCESS,
    failureType: ActionTypes.GET_SNAPSHOTS_FAILURE,
  }),
});

export const { refreshSnapshots } = createActions({
  [ActionTypes.REFRESH_SNAPSHOTS]: () => ({}),
});

export const { getDatasetSnapshots } = createActions({
  [ActionTypes.GET_DATASET_SNAPSHOTS_SUCCESS]: (snapshots) => snapshots,
  [ActionTypes.GET_DATASET_SNAPSHOTS]: (limit, offset, sort, direction, datasetIds) => ({
    limit,
    offset,
    sort,
    direction,
    datasetIds,
    successType: ActionTypes.GET_DATASET_SNAPSHOTS_SUCCESS,
    failureType: ActionTypes.GET_DATASET_SNAPSHOTS_FAILURE,
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

export const { removeSnapshotPolicyMembers } = createActions({
  [ActionTypes.REMOVE_SNAPSHOT_POLICY_MEMBERS]: (snapshotId, users, policy) => ({
    snapshotId,
    users,
    policy,
  }),
});

export const { getUserSnapshotRoles } = createActions({
  [ActionTypes.GET_USER_SNAPSHOT_ROLES]: (snapshotId) => snapshotId,
  [ActionTypes.GET_USER_SNAPSHOT_ROLES_SUCCESS]: (roles) => roles,
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

export const { refreshDatasets } = createActions({
  [ActionTypes.REFRESH_DATASETS]: () => ({}),
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

export const { addDatasetPolicyMember } = createActions({
  [ActionTypes.ADD_DATASET_POLICY_MEMBER]: (datasetId, user, policy) => ({
    datasetId,
    user,
    policy,
  }),
});

export const { patchDataset } = createActions({
  [ActionTypes.PATCH_DATASET]: (datasetId, data) => ({
    datasetId,
    data,
  }),
});

export const { patchSnapshot } = createActions({
  [ActionTypes.PATCH_SNAPSHOT]: (snapshotId, data) => ({
    snapshotId,
    data,
  }),
});

export const { removeDatasetPolicyMember } = createActions({
  [ActionTypes.REMOVE_DATASET_POLICY_MEMBER]: (datasetId, user, policy) => ({
    datasetId,
    user,
    policy,
  }),
});

export const { getUserDatasetRoles } = createActions({
  [ActionTypes.GET_USER_DATASET_ROLES]: (datasetId) => datasetId,
  [ActionTypes.GET_USER_DATASET_ROLES_SUCCESS]: (roles) => roles,
});

export const { getJobs } = createActions({
  [ActionTypes.GET_JOBS_SUCCESS]: (jobs) => jobs,
  [ActionTypes.GET_JOBS]: ({ limit, offset, sort, direction, searchString, errMessage }) => ({
    limit,
    offset,
    sort,
    direction,
    searchString,
    errMessage,
  }),
});

export const { getJobById } = createActions({
  [ActionTypes.GET_JOB_BY_ID]: (job) => job,
  [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (job) => job,
});

export const { clearJobId } = createActions({
  [ActionTypes.CLEAR_JOB_ID]: (job) => job,
});

export const { getJobResult } = createActions({
  [ActionTypes.GET_JOB_RESULT]: (id) => id,
});

export const { getJournalEntries } = createActions({
  [ActionTypes.GET_JOURNAL_ENTRIES]: ({ limit, offset, id, resourceType }) => ({
    limit,
    offset,
    id,
    resourceType,
  }),
});

export const { hideAlert } = createActions({
  [ActionTypes.HIDE_ALERT]: (index) => index,
});

export const { runQuery } = createActions({
  [ActionTypes.RUN_QUERY_SUCCESS]: (result) => result,
  [ActionTypes.RUN_QUERY]: (projectId, query) => ({
    projectId,
    query,
  }),
});

export const { refreshQuery } = createActions({
  [ActionTypes.REFRESH_QUERY]: () => ({}),
});

export const { previewData } = createActions({
  [ActionTypes.PREVIEW_DATA]: (
    resourceType,
    resourceId,
    table,
    columns,
    totalRowCount,
    orderDirection,
    orderProperty,
  ) => ({
    resourceType,
    resourceId,
    table,
    columns,
    totalRowCount,
    orderDirection,
    orderProperty,
  }),
  [ActionTypes.PREVIEW_DATA_SUCCESS]: (queryResults, columns) => ({
    queryResults,
    columns,
  }),
  [ActionTypes.PREVIEW_DATA_FAILURE]: (errMsg) => ({ errMsg }),
});

export const { pageQuery } = createActions({
  [ActionTypes.PAGE_QUERY]: (pageToken, projectId, jobId, location) => ({
    pageToken,
    projectId,
    jobId,
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

export const { resizeColumn } = createActions({
  [ActionTypes.RESIZE_COLUMN]: (property, width) => ({
    property,
    width,
  }),
});

export const { resetQuery } = createActions({
  [ActionTypes.RESET_QUERY]: () => ({}),
});

export const { changeRowsPerPage } = createActions({
  [ActionTypes.CHANGE_ROWS_PER_PAGE]: (rowsPerPage) => rowsPerPage,
});

export const { changePage } = createActions({
  [ActionTypes.CHANGE_PAGE]: (page) => page,
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

export const { changePolicyUsersToSnapshotRequest } = createActions({
  [ActionTypes.CHANGE_POLICY_USERS_TO_SNAPSHOT_REQUEST]: (policy, users) => ({
    policy,
    users,
  }),
});
