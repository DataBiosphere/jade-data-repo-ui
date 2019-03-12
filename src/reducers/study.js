import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const studyState = {
  studies: [],
};

export default {
  studies: handleActions(
    {
      [ActionTypes.GET_STUDIES_SUCCESS]: (state, action) => {
        return immutable(state, {
          studies: { $set: action.studies.data.data },
        });
      },
    },
    studyState,
  ),
};
