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
  ADD_READER_TO_SNAPSHOT: undefined,
  ADD_READER_TO_SNAPSHOT_SUCCESS: undefined,
  REMOVE_READER_FROM_SNAPSHOT: undefined,
  REMOVE_READER_FROM_SNAPSHOT_SUCCESS: undefined,
  ADD_CUSTODIAN_TO_SNAPSHOT: undefined,
  ADD_CUSTODIAN_TO_SNAPSHOT_SUCCESS: undefined,
  REMOVE_CUSTODIAN_FROM_SNAPSHOT: undefined,
  REMOVE_CUSTODIAN_FROM_SNAPSHOT_SUCCESS: undefined,
  GET_DATASET_POLICY: undefined,
  GET_DATASET_POLICY_SUCCESS: undefined,
  ADD_CUSTODIAN_TO_DATASET: undefined,
  ADD_CUSTODIAN_TO_DATASET_SUCCESS: undefined,
  REMOVE_CUSTODIAN_FROM_DATASET: undefined,
  REMOVE_CUSTODIAN_FROM_DATASET_SUCCESS: undefined,
  GET_JOB_RESULT: undefined,
  GET_JOB_RESULT_SUCCESS: undefined,
  GET_JOB_RESULT_FAILURE: undefined,
  GET_JOB_BY_ID: undefined,
  GET_JOB_BY_ID_SUCCESS: undefined,
  CLEAR_JOB_ID: undefined,
  GET_DATASET_TABLE_PREVIEW: undefined,
  GET_DATASET_TABLE_PREVIEW_SUCCESS: undefined,
  GET_CONFIGURATION: undefined,
  GET_CONFIGURATION_SUCCESS: undefined,
  RUN_QUERY: undefined,
  RUN_QUERY_SUCCESS: undefined,
  QUERY_MENU_SELECT: undefined,
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
