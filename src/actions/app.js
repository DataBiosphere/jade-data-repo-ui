// @flow
/**
 * @module Actions/App
 * @desc App Actions
 */

import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { createDataset } = createActions({
  [ActionTypes.CREATE_DATASET]: dataset => dataset,
  [ActionTypes.CREATE_DATASET_JOB]: dataset => dataset,
  [ActionTypes.CREATE_DATASET_SUCCESS]: dataset => dataset,
  [ActionTypes.CREATE_DATASET_FAILURE]: dataset => dataset,
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

export const { addReaderToDataset } = createActions({
  [ActionTypes.ADD_READER_TO_DATASET]: (datasetId, users) => ({
    datasetId,
    users,
  }),
});

export const { removeReaderFromDataset } = createActions({
  [ActionTypes.REMOVE_READER_FROM_DATASET]: (datasetId, user) => ({
    datasetId,
    user,
  }),
});

export const { getStudies } = createActions({
  [ActionTypes.GET_STUDIES_SUCCESS]: studies => studies,
  [ActionTypes.GET_STUDIES]: (limit, offset, sort, direction, searchString) => ({
    limit,
    offset,
    sort,
    direction,
    searchString,
  }),
});

export const { getStudyById } = createActions({
  [ActionTypes.GET_STUDY_BY_ID]: study => study,
  [ActionTypes.GET_STUDY_BY_ID_SUCCESS]: study => study,
});

export const { getStudyPolicy } = createActions({
  [ActionTypes.GET_STUDY_POLICY]: policy => policy,
  [ActionTypes.GET_STUDY_POLICY_SUCCESS]: policy => policy,
});

export const { getStudyTablePreview } = createActions({
  [ActionTypes.GET_STUDY_TABLE_PREVIEW]: (study, tableName) => ({ study, tableName }),
  [ActionTypes.GET_STUDY_TABLE_PREVIEW_SUCCESS]: _ => _,
});

export const { addCustodianToStudy } = createActions({
  [ActionTypes.ADD_CUSTODIAN_TO_STUDY]: (studyId, users) => ({
    studyId,
    users,
  }),
});

export const { removeCustodianFromStudy } = createActions({
  [ActionTypes.REMOVE_CUSTODIAN_FROM_STUDY]: (studyId, user) => ({
    studyId,
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
