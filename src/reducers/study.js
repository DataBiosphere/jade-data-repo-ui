import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const studyState = {
  studies: [],
  study: {},
  studiesCount: 0,
};

export default {
  studies: handleActions(
    {
      [ActionTypes.GET_STUDIES_SUCCESS]: (state, action) =>
        immutable(state, {
          studies: { $set: action.studies.data.data.items },
          studiesCount: { $set: action.studies.data.data.total },
        }),
      [ActionTypes.GET_STUDY_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          study: { $set: action.study.data.data },
        }),
      [ActionTypes.CREATE_DATASET_JOB]: state =>
        immutable(state, {
          study: { $set: {} },
        }),
    },
    studyState,
  ),
};
