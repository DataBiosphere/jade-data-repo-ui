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

export const { getDatasetById } = createActions({
  [ActionTypes.GET_DATASET_BY_ID]: dataset => dataset,
  [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: dataset => dataset,
});

export const { getStudyById } = createActions({
  [ActionTypes.GET_STUDY_BY_ID]: study => study,
  [ActionTypes.GET_STUDY_BY_ID_SUCCESS]: study => study,
});
