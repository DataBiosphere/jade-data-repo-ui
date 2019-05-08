import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes, STATUS } from 'constants/index';

export const jobState = {
  finished: '',
  jobId: '',
  jobStatus: '',
  jobResultObjectId: '',
};

export default {
  jobs: handleActions(
    {
      [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (state, action) => {
        return immutable(state, {
          jobStatus: { $set: action.payload.status },
        });
      },
      [ActionTypes.GET_JOB_RESULT_SUCCESS]: (state, action) => {
        return immutable(state, {
          jobResultObjectId: { $set: action.payload.data.id },
        });
      },
      [ActionTypes.CREATE_DATASET_JOB]: (state, action) => {
        return immutable(state, {
          jobId: { $set: action.payload.jobId },
        });
      },
      [ActionTypes.CREATE_DATASET_SUCCESS]: state => {
        return immutable(state, {
          jobStatus: { $set: STATUS.SUCCESS },
        });
      },
      [ActionTypes.CLEAR_JOB_ID]: state => {
        return immutable(state, {
          jobId: { $set: '' },
        });
      },
    },
    jobState,
  ),
};
