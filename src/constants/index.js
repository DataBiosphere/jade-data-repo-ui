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
  SET_DATASET_POLICY: undefined,
  SET_DATASET_POLICY_SUCCESS: undefined,
  GET_JOB_RESULT: undefined,
  GET_JOB_RESULT_SUCCESS: undefined,
  GET_JOB_RESULT_FAILURE: undefined,
  GET_JOB_BY_ID: undefined,
  GET_JOB_BY_ID_SUCCESS: undefined,
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
