import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export const ActionTypes = keyMirror({
  SWITCH_MENU: undefined,
  EXCEPTION: undefined,
  SHOW_ALERT: undefined,
  HIDE_ALERT: undefined,
  USER_LOGIN: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_LOGOUT: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,
  CREATE_SNAPSHOT: undefined,
  CREATE_SNAPSHOT_JOB: undefined,
  CREATE_SNAPSHOT_SUCCESS: undefined,
  CREATE_SNAPSHOT_FAILURE: undefined,
  EXPORT_SNAPSHOT_EXCEPTION: undefined,
  EXPORT_SNAPSHOT: undefined,
  EXPORT_SNAPSHOT_JOB: undefined,
  EXPORT_SNAPSHOT_SUCCESS: undefined,
  EXPORT_SNAPSHOT_FAILURE: undefined,
  GET_DATASETS: undefined,
  GET_DATASETS_SUCCESS: undefined,
  GET_DATASET_BY_ID: undefined,
  GET_DATASET_BY_ID_SUCCESS: undefined,
  GET_SNAPSHOTS: undefined,
  GET_SNAPSHOTS_SUCCESS: undefined,
  GET_SNAPSHOT_BY_ID: undefined,
  GET_SNAPSHOT_BY_ID_SUCCESS: undefined,
  GET_SNAPSHOT_POLICY: undefined,
  GET_SNAPSHOT_POLICY_SUCCESS: undefined,
  GET_SNAPSHOT_POLICY_FAILURE: undefined,
  ADD_SNAPSHOT_POLICY_MEMBER: undefined,
  ADD_SNAPSHOT_POLICY_MEMBER_SUCCESS: undefined,
  REMOVE_SNAPSHOT_POLICY_MEMBER: undefined,
  REMOVE_SNAPSHOT_POLICY_MEMBER_SUCCESS: undefined,
  GET_DATASET_POLICY: undefined,
  GET_DATASET_POLICY_SUCCESS: undefined,
  ADD_CUSTODIAN_TO_DATASET: undefined,
  ADD_CUSTODIAN_TO_DATASET_SUCCESS: undefined,
  REMOVE_CUSTODIAN_FROM_DATASET: undefined,
  REMOVE_CUSTODIAN_FROM_DATASET_SUCCESS: undefined,
  GET_BILLING_PROFILE_BY_ID: undefined,
  GET_BILLING_PROFILE_BY_ID_SUCCESS: undefined,
  GET_JOB_RESULT: undefined,
  GET_JOB_RESULT_SUCCESS: undefined,
  GET_JOB_RESULT_FAILURE: undefined,
  GET_JOB_BY_ID: undefined,
  GET_JOB_BY_ID_SUCCESS: undefined,
  CLEAR_JOB_ID: undefined,
  GET_DATASET_TABLE_PREVIEW: undefined,
  GET_DATASET_TABLE_PREVIEW_SUCCESS: undefined,
  GET_CONFIGURATION_SUCCESS: undefined,
  RUN_QUERY: undefined,
  RUN_QUERY_SUCCESS: undefined,
  QUERY_MENU_SELECT: undefined,
  APPLY_FILTERS: undefined,
  APPLY_FILTERS_SUCCESS: undefined,
  POLL_QUERY: undefined,
  PAGE_QUERY: undefined,
  PAGE_QUERY_SUCCESS: undefined,
  APPLY_SORT: undefined,
  OPEN_SNAPSHOT_DIALOG: undefined,
  COUNT_RESULTS: undefined,
  COUNT_RESULTS_SUCCESS: undefined,
  SNAPSHOT_CREATE_DETAILS: undefined,
  ADD_READERS_TO_SNAPSHOT: undefined,
  GET_FEATURES: undefined,
  GET_FEATURES_SUCCESS: undefined,
  GET_SERVER_STATUS_SUCCESS: undefined,
  GET_SERVER_STATUS_FAILURE: undefined,
  GET_SERVER_STATUS_DOWN: undefined,
});

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  READY: 'ready',
  SUCCESS: 'success', // should this be succeeded ?
  ERROR: 'error',
};

export const IMAGE = {
  DEFAULT: 'default',
};

export const DB_COLUMNS = {
  ROW_ID: 'datarepo_row_id',
};

export const COLUMN_MODES = {
  NULLABLE: 'NULLABLE',
  REPEATED: 'REPEATED',
  REQUIRED: 'REQUIRED',
};

export const SNAPSHOT_ROLES = {
  STEWARD: 'steward',
  READER: 'reader',
};

export const GOOGLE_CLOUD_RESOURCE = {
  BIGQUERY: 'bigquery',
  FIRESTORE: 'firestore',
  BUCKET: 'bucket',
};

export const DATASET_ROLES = {
  STEWARD: 'steward',
  CUSTODIAN: 'custodian',
  SNAPSHOT_CREATOR: 'snapshot_creator',
};
