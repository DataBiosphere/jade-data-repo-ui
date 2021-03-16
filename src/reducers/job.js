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
      [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          jobStatus: { $set: action.payload.status },
        }),
      [ActionTypes.GET_JOB_RESULT_SUCCESS]: (state, action) =>
        immutable(state, {
          jobResultObjectId: { $set: action.payload.data.id },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state, action) =>
        immutable(state, {
          jobId: { $set: action.payload.jobId },
        }),
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state) =>
        immutable(state, {
          jobStatus: { $set: STATUS.SUCCESS },
        }),
      [ActionTypes.CLEAR_JOB_ID]: (state) =>
        immutable(state, {
          jobId: { $set: '' },
        }),
      [ActionTypes.USER_LOGOUT]: () => jobState,
    },
    jobState,
  ),
};
