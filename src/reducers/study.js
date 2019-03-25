import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const studyState = {
  studies: [],
  study: {},
};

export default {
  studies: handleActions(
    {
      [ActionTypes.GET_STUDIES_SUCCESS]: (state, action) => {
        return immutable(state, {
          studies: { $set: action.studies.data.data },
        });
      },
      [ActionTypes.GET_STUDY_BY_ID_SUCCESS]: (state, action) => {
        return immutable(state, {
          study: { $set: action.study.data.data },
        });
      },
    },
    studyState,
  ),
};
