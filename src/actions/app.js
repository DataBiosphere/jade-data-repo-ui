// @flow
/**
 * @module Actions/App
 * @desc App Actions
 */

import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { createSnapshot } = createActions({
  [ActionTypes.CREATE_SNAPSHOT]: snapshot => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_JOB]: snapshot => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: snapshot => snapshot,
  [ActionTypes.CREATE_SNAPSHOT_FAILURE]: snapshot => snapshot,
});

export const { getSnapshots } = createActions({
  [ActionTypes.GET_SNAPSHOTS_SUCCESS]: snapshots => snapshots,
  [ActionTypes.GET_SNAPSHOTS]: (limit, offset, sort, direction, searchString) => ({
    limit,
    offset,
    sort,
    direction,
    searchString,
  }),
});

export const { getSnapshotById } = createActions({
  [ActionTypes.GET_SNAPSHOT_BY_ID]: snapshot => snapshot,
  [ActionTypes.GET_SNAPSHOT_BY_ID_SUCCESS]: snapshot => snapshot,
});

export const { getSnapshotPolicy } = createActions({
  [ActionTypes.GET_SNAPSHOT_POLICY]: policy => policy,
  [ActionTypes.GET_SNAPSHOT_POLICY_SUCCESS]: policy => policy,
});

export const { addCustodianToSnapshot } = createActions({
  [ActionTypes.ADD_CUSTODIAN_TO_SNAPSHOT]: (snapshotId, users) => ({
    snapshotId,
    users,
  }),
});

export const { removeCustodianFromSnapshot } = createActions({
  [ActionTypes.REMOVE_CUSTODIAN_FROM_SNAPSHOT]: (snapshotId, user) => ({
    snapshotId,
    user,
  }),
});

export const { addReaderToSnapshot } = createActions({
  [ActionTypes.ADD_READER_TO_SNAPSHOT]: (snapshotId, users) => ({
    snapshotId,
    users,
  }),
});

export const { removeReaderFromSnapshot } = createActions({
  [ActionTypes.REMOVE_READER_FROM_SNAPSHOT]: (snapshotId, user) => ({
    snapshotId,
    user,
  }),
});

export const { getDatasets } = createActions({
  [ActionTypes.GET_DATASETS_SUCCESS]: datasets => datasets,
  [ActionTypes.GET_DATASETS]: (limit, offset, sort, direction, searchString) => ({
    limit,
    offset,
    sort,
    direction,
    searchString,
  }),
});

export const { getDatasetById } = createActions({
  [ActionTypes.GET_DATASET_BY_ID]: dataset => dataset,
  [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: dataset => dataset,
});

export const { getDatasetPolicy } = createActions({
  [ActionTypes.GET_DATASET_POLICY]: policy => policy,
  [ActionTypes.GET_DATASET_POLICY_SUCCESS]: policy => policy,
});

export const { getDatasetTablePreview } = createActions({
  [ActionTypes.GET_DATASET_TABLE_PREVIEW]: (dataset, tableName) => ({ dataset, tableName }),
  [ActionTypes.GET_DATASET_TABLE_PREVIEW_SUCCESS]: _ => _,
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
  [ActionTypes.GET_JOB_BY_ID]: job => job,
  [ActionTypes.GET_JOB_BY_ID_SUCCESS]: job => job,
});

export const { clearJobId } = createActions({
  [ActionTypes.CLEAR_JOB_ID]: job => job,
});

export const { hideAlert } = createActions({
  [ActionTypes.HIDE_ALERT]: index => index,
});

export const { runQuery } = createActions({
  [ActionTypes.RUN_QUERY_SUCCESS]: result => result,
  [ActionTypes.RUN_QUERY]: (projectId, query, maxResults) => ({
    projectId,
    query,
    maxResults,
  }),
});

export const { pageQuery } = createActions({
  [ActionTypes.PAGE_QUERY]: (pageToken, projectId, jobId, pageSize) => ({
    pageToken,
    projectId,
    jobId,
    pageSize,
  }),
});

export const { applyFilters } = createActions({
  [ActionTypes.APPLY_FILTERS]: (filters, schema, table) => ({
    filters,
    schema,
    table,
  }),
});

export const { applySort } = createActions({
  [ActionTypes.APPLY_SORT]: (property, direction) => ({
    property,
    direction,
  }),
});
