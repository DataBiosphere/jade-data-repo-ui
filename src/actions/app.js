// @flow
/**
 * @module Actions/App
 * @desc App Actions
 */

import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export { goBack, go, push, replace } from 'modules/history';

export const { createDataset } = createActions({
  [ActionTypes.CREATE_DATASET]: dataset => dataset,
});

export const { getStudies } = createActions({
  [ActionTypes.GET_STUDIES_SUCCESS]: studies => studies,
  [ActionTypes.GET_STUDIES]: studies => studies,
});

export const { getDatasets } = createActions({
  [ActionTypes.GET_DATASETS_SUCCESS]: datasets => datasets,
  [ActionTypes.GET_DATASETS]: datasets => datasets,
});
