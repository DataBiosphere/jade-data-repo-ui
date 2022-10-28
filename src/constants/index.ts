/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export enum ActionTypes {
  SWITCH_MENU = 'SWITCH_MENU',
  SHOW_ALERT = 'SHOW_ALERT',
  HIDE_ALERT = 'HIDE_ALERT',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILURE = 'USER_LOGIN_FAILURE',
  USER_REFRESH = 'USER_REFRESH',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS',
  USER_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE',
  GET_USER_STATUS = 'GET_USER_STATUS',
  GET_USER_STATUS_SUCCESS = 'GET_USER_STATUS_SUCCESS',
  GET_USER_STATUS_FAILURE = 'GET_USER_STATUS_FAILURE',
  CHANGE_PAGE = 'CHANGE_PAGE',
  CHANGE_ROWS_PER_PAGE = 'CHANGE_ROWS_PER_PAGE',
  CREATE_SNAPSHOT = 'CREATE_SNAPSHOT',
  CREATE_SNAPSHOT_JOB = 'CREATE_SNAPSHOT_JOB',
  CREATE_SNAPSHOT_SUCCESS = 'CREATE_SNAPSHOT_SUCCESS',
  CREATE_SNAPSHOT_FAILURE = 'CREATE_SNAPSHOT_FAILURE',
  CREATE_SNAPSHOT_EXCEPTION = 'CREATE_SNAPSHOT_EXCEPTION',
  EXPORT_SNAPSHOT_EXCEPTION = 'EXPORT_SNAPSHOT_EXCEPTION',
  EXPORT_SNAPSHOT = 'EXPORT_SNAPSHOT',
  EXPORT_SNAPSHOT_START = 'EXPORT_SNAPSHOT_START',
  EXPORT_SNAPSHOT_JOB = 'EXPORT_SNAPSHOT_JOB',
  EXPORT_SNAPSHOT_SUCCESS = 'EXPORT_SNAPSHOT_SUCCESS',
  EXPORT_SNAPSHOT_FAILURE = 'EXPORT_SNAPSHOT_FAILURE',
  RESET_SNAPSHOT_EXPORT = 'RESET_SNAPSHOT_EXPORT',
  RESET_SNAPSHOT_EXPORT_DATA = 'RESET_SNAPSHOT_EXPORT_DATA',
  REFRESH_DATASETS = 'REFRESH_DATASETS',
  GET_DATASETS = 'GET_DATASETS',
  GET_DATASETS_SUCCESS = 'GET_DATASETS_SUCCESS',
  GET_DATASETS_FAILURE = 'GET_DATASETS_FAILURE',
  GET_DATASET_BY_ID = 'GET_DATASET_BY_ID',
  GET_DATASET_BY_ID_SUCCESS = 'GET_DATASET_BY_ID_SUCCESS',
  GET_DATASET_SNAPSHOTS_FAILURE = 'GET_DATASET_SNAPSHOTS_FAILURE',
  GET_DATASET_SNAPSHOTS_SUCCESS = 'GET_DATASET_SNAPSHOTS_SUCCESS',
  GET_DATASET_SNAPSHOTS = 'GET_DATASET_SNAPSHOTS',
  REFRESH_SNAPSHOTS = 'REFRESH_SNAPSHOTS',
  GET_SNAPSHOTS = 'GET_SNAPSHOTS',
  GET_SNAPSHOTS_SUCCESS = 'GET_SNAPSHOTS_SUCCESS',
  GET_SNAPSHOTS_FAILURE = 'GET_SNAPSHOTS_FAILURE',
  GET_SNAPSHOT_BY_ID = 'GET_SNAPSHOT_BY_ID',
  GET_SNAPSHOT_BY_ID_SUCCESS = 'GET_SNAPSHOT_BY_ID_SUCCESS',
  GET_SNAPSHOT_POLICY = 'GET_SNAPSHOT_POLICY',
  GET_SNAPSHOT_POLICY_SUCCESS = 'GET_SNAPSHOT_POLICY_SUCCESS',
  GET_SNAPSHOT_POLICY_FAILURE = 'GET_SNAPSHOT_POLICY_FAILURE',
  ADD_SNAPSHOT_POLICY_MEMBER = 'ADD_SNAPSHOT_POLICY_MEMBER',
  ADD_SNAPSHOT_POLICY_MEMBER_FAILURE = 'ADD_SNAPSHOT_POLICY_MEMBER_FAILURE',
  ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS = 'ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS',
  REMOVE_SNAPSHOT_POLICY_MEMBER = 'REMOVE_SNAPSHOT_POLICY_MEMBER',
  REMOVE_SNAPSHOT_POLICY_MEMBER_FAILURE = 'REMOVE_SNAPSHOT_POLICY_MEMBER_FAILURE',
  REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS = 'REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS',
  GET_USER_SNAPSHOT_ROLES = 'GET_USER_SNAPSHOT_ROLES',
  GET_USER_SNAPSHOT_ROLES_SUCCESS = 'GET_USER_SNAPSHOT_ROLES_SUCCESS',
  GET_DATASET_POLICY = 'GET_DATASET_POLICY',
  GET_DATASET_POLICY_SUCCESS = 'GET_DATASET_POLICY_SUCCESS',
  ADD_DATASET_POLICY_MEMBER = 'ADD_DATASET_POLICY_MEMBER',
  ADD_DATASET_POLICY_MEMBER_FAILURE = 'ADD_DATASET_POLICY_MEMBER_FAILURE',
  ADD_DATASET_POLICY_MEMBER_SUCCESS = 'ADD_DATASET_POLICY_MEMBER_SUCCESS',
  REMOVE_DATASET_POLICY_MEMBER = 'REMOVE_DATASET_POLICY_MEMBER',
  REMOVE_DATASET_POLICY_MEMBER_FAILURE = 'REMOVE_DATASET_POLICY_MEMBER_FAILURE',
  REMOVE_DATASET_POLICY_MEMBER_SUCCESS = 'REMOVE_DATASET_POLICY_MEMBER_SUCCESS',
  REMOVE_SNAPSHOT_POLICY_MEMBERS = 'REMOVE_SNAPSHOT_POLICY_MEMBERS',
  REMOVE_SNAPSHOT_POLICY_MEMBERS_SUCCESS = 'REMOVE_SNAPSHOT_POLICY_MEMBERS_SUCCESS',
  REMOVE_SNAPSHOT_POLICY_MEMBERS_EXCEPTION = 'REMOVE_SNAPSHOT_POLICY_MEMBERS_EXCEPTION',
  GET_USER_DATASET_ROLES = 'GET_USER_DATASET_ROLES',
  GET_USER_DATASET_ROLES_SUCCESS = 'GET_USER_DATASET_ROLES_SUCCESS',
  GET_BILLING_PROFILE_BY_ID = 'GET_BILLING_PROFILE_BY_ID',
  GET_BILLING_PROFILE_BY_ID_SUCCESS = 'GET_BILLING_PROFILE_BY_ID_SUCCESS',
  GET_BILLING_PROFILE_BY_ID_EXCEPTION = 'GET_BILLING_PROFILE_BY_ID_EXCEPTION',
  GET_JOBS = 'GET_JOBS',
  GET_JOBS_SUCCESS = 'GET_JOBS_SUCCESS',
  GET_JOBS_FAILURE = 'GET_JOBS_FAILURE',
  GET_JOB_RESULT = 'GET_JOB_RESULT',
  GET_JOB_RESULT_SUCCESS = 'GET_JOB_RESULT_SUCCESS',
  GET_JOB_RESULT_FAILURE = 'GET_JOB_RESULT_FAILURE',
  GET_JOB_BY_ID = 'GET_JOB_BY_ID',
  GET_JOB_BY_ID_SUCCESS = 'GET_JOB_BY_ID_SUCCESS',
  CLEAR_JOB_ID = 'CLEAR_JOB_ID',
  GET_DATASET_TABLE_PREVIEW = 'GET_DATASET_TABLE_PREVIEW',
  GET_DATASET_TABLE_PREVIEW_SUCCESS = 'GET_DATASET_TABLE_PREVIEW_SUCCESS',
  GET_CONFIGURATION_SUCCESS = 'GET_CONFIGURATION_SUCCESS',
  RESET_QUERY = 'RESET_QUERY',
  RUN_QUERY = 'RUN_QUERY',
  RUN_QUERY_SUCCESS = 'RUN_QUERY_SUCCESS',
  QUERY_MENU_SELECT = 'QUERY_MENU_SELECT',
  APPLY_FILTERS = 'APPLY_FILTERS',
  APPLY_FILTERS_SUCCESS = 'APPLY_FILTERS_SUCCESS',
  POLL_QUERY = 'POLL_QUERY',
  REFRESH_QUERY = 'REFRESH_QUERY',
  PAGE_QUERY = 'PAGE_QUERY',
  PAGE_QUERY_SUCCESS = 'PAGE_QUERY_SUCCESS',
  PREVIEW_DATA = 'PREVIEW_DATA',
  PREVIEW_DATA_SUCCESS = 'PREVIEW_DATA_SUCCESS',
  PREVIEW_DATA_FAILURE = 'PREVIEW_DATA_FAILURE',
  APPLY_SORT = 'APPLY_SORT',
  RESIZE_COLUMN = 'RESIZE_COLUMN',
  OPEN_SNAPSHOT_DIALOG = 'OPEN_SNAPSHOT_DIALOG',
  COUNT_RESULTS = 'COUNT_RESULTS',
  COUNT_RESULTS_SUCCESS = 'COUNT_RESULTS_SUCCESS',
  SNAPSHOT_CREATE_DETAILS = 'SNAPSHOT_CREATE_DETAILS',
  CHANGE_POLICY_USERS_TO_SNAPSHOT_REQUEST = 'CHANGE_POLICY_USERS_TO_SNAPSHOT_REQUEST',
  GET_FEATURES = 'GET_FEATURES',
  GET_FEATURES_SUCCESS = 'GET_FEATURES_SUCCESS',
  GET_SERVER_STATUS_SUCCESS = 'GET_SERVER_STATUS_SUCCESS',
  GET_SERVER_STATUS_FAILURE = 'GET_SERVER_STATUS_FAILURE',
  GET_SERVER_STATUS_DOWN = 'GET_SERVER_STATUS_DOWN',
  PATCH_DATASET_DESCRIPTION = 'PATCH_DATASET_DESCRIPTION',
  PATCH_DATASET_DESCRIPTION_SUCCESS = 'PATCH_DATASET_DESCRIPTION_SUCCESS',
  PATCH_SNAPSHOT_DESCRIPTION = 'PATCH_SNAPSHOT_DESCRIPTION',
  PATCH_SNAPSHOT_DESCRIPTION_SUCCESS = 'PATCH_SNAPSHOT_DESCRIPTION_SUCCESS',
  EXCEPTION = 'EXCEPTION',
}

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export enum Status {
  IDLE = 'idle',
  RUNNING = 'running',
  READY = 'ready',
  SUCCESS = 'success', // should this be succeeded ?
  ERROR = 'error',
}

export enum DbColumns {
  ROW_ID = 'datarepo_row_id',
}

export enum ColumnModes {
  NULLABLE = 'NULLABLE',
  REPEATED = 'REPEATED',
  REQUIRED = 'REQUIRED',
}

export enum SnapshotRoles {
  STEWARD = 'steward',
  READER = 'reader',
  DISCOVERER = 'discoverer',
}

export enum GoogleCloudResource {
  BIGQUERY = 'bigquery',
  FIRESTORE = 'firestore',
  BUCKET = 'bucket',
}

export enum DatasetRoles {
  STEWARD = 'steward',
  CUSTODIAN = 'custodian',
  SNAPSHOT_CREATOR = 'snapshot_creator',
}

export enum IamResourceTypes {
  DATASET = 'dataset',
  SNAPSHOT = 'datasnapshot',
}

export enum DatasetIncludeOptions {
  NONE = 'NONE',
  SCHEMA = 'SCHEMA',
  ACCESS_INFORMATION = 'ACCESS_INFORMATION',
  PROFILE = 'PROFILE',
  DATA_PROJECT = 'DATA_PROJECT',
  STORAGE = 'STORAGE',
}

export enum SnapshotIncludeOptions {
  NONE = 'NONE',
  SOURCES = 'SOURCES',
  TABLES = 'TABLES',
  RELATIONSHIPS = 'RELATIONSHIPS',
  ACCESS_INFORMATION = 'ACCESS_INFORMATION',
  PROFILE = 'PROFILE',
  DATA_PROJECT = 'DATA_PROJECT',
}

export enum BreadcrumbType {
  DATASET = 'dataset',
  SNAPSHOT = 'snapshot',
}

export enum ResourceType {
  DATASET = 'dataset',
  SNAPSHOT = 'snapshot',
  JOB = 'job',
}

/** Shared Defaults */
export const TABLE_DEFAULT_ROWS_PER_PAGE = 100;
export const TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS = [25, 100, 250];
export const TABLE_DEFAULT_SORT_ORDER = 'asc';
export const TABLE_DEFAULT_COLUMN_WIDTH = 300;
