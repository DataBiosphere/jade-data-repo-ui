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
  USER_LOGIN: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_LOGOUT: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,
  CREATE_DATASET: undefined,
  DATASET_CREATE_SUCCESS: undefined,
  GET_STUDIES_SUCCESS: undefined,
  GET_STUDIES: undefined,
  GET_STUDY_BY_ID: undefined,
  GET_STUDY_BY_ID_SUCCESS: undefined,
  GET_DATASETS_SUCCESS: undefined,
  GET_DATASETS: undefined,
  GET_DATASET_BY_ID: undefined,
  GET_DATASET_BY_ID_SUCCESS: undefined,
});

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const IMAGE = {
  DEFAULT: 'default',
};
