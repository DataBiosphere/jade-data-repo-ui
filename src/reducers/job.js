import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const jobState = {
  jobStatus: '',
  jobResultObjectId: '',
};

export default {
  jobs: handleActions(
    {
      [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          jobStatus: { $set: action.jobs.data },
        }),
      [ActionTypes.GET_JOB_RESULT_SUCCESS]: (state, action) =>
        immutable(state, {
          jobResultObjectId: { $set: action.jobs.data.id },
        }),
    },
    jobState,
  ),
};
