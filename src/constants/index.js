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
  CREATE_DATASET: undefined,
  CREATE_DATASET_JOB: undefined,
  CREATE_DATASET_SUCCESS: undefined,
  CREATE_DATASET_FAILURE: undefined,
  GET_STUDIES: undefined,
  GET_STUDIES_SUCCESS: undefined,
  GET_STUDY_BY_ID: undefined,
  GET_STUDY_BY_ID_SUCCESS: undefined,
  GET_DATASETS: undefined,
  GET_DATASETS_SUCCESS: undefined,
  GET_DATASET_BY_ID: undefined,
  GET_DATASET_BY_ID_SUCCESS: undefined,
  GET_DATASET_POLICY: undefined,
  GET_DATASET_POLICY_SUCCESS: undefined,
  ADD_READER_TO_DATASET: undefined,
  ADD_READER_TO_DATASET_SUCCESS: undefined,
  REMOVE_READER_FROM_DATASET: undefined,
  REMOVE_READER_FROM_DATASET_SUCCESS: undefined,
  ADD_CUSTODIAN_TO_DATASET: undefined,
  ADD_CUSTODIAN_TO_DATASET_SUCCESS: undefined,
  REMOVE_CUSTODIAN_FROM_DATASET: undefined,
  REMOVE_CUSTODIAN_FROM_DATASET_SUCCESS: undefined,
  GET_STUDY_POLICY: undefined,
  GET_STUDY_POLICY_SUCCESS: undefined,
  ADD_CUSTODIAN_TO_STUDY: undefined,
  ADD_CUSTODIAN_TO_STUDY_SUCCESS: undefined,
  REMOVE_CUSTODIAN_FROM_STUDY: undefined,
  REMOVE_CUSTODIAN_FROM_STUDY_SUCCESS: undefined,
  GET_JOB_RESULT: undefined,
  GET_JOB_RESULT_SUCCESS: undefined,
  GET_JOB_RESULT_FAILURE: undefined,
  GET_JOB_BY_ID: undefined,
  GET_JOB_BY_ID_SUCCESS: undefined,
  CLEAR_JOB_ID: undefined,
  GET_STUDY_TABLE_PREVIEW: undefined,
  GET_STUDY_TABLE_PREVIEW_SUCCESS: undefined,
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
