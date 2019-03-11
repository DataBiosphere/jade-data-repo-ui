// @flow
/**
 * @module Actions/App
 * @desc App Actions
 */

import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export { goBack, go, push, replace } from 'modules/history';

export const { createDataset } = createActions({
  [ActionTypes.GET_STUDIES_SUCCESS]: studies => studies,
  [ActionTypes.CREATE_DATASET]: dataset => dataset,
});
