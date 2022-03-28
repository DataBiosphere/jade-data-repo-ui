import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes, STATUS } from '../constants';

export interface JobState {
  finished: string,
  jobId: string,
  jobStatus: STATUS,
  jobResultObjectId: string,
}

export const initialJobState : JobState = {
  finished: '',
  jobId: '',
  jobStatus: STATUS.IDLE,
  jobResultObjectId: '',
};

interface ResponseOptions {
  status: string;
  jobId: string;
  data: {
    id: string;
  };
}

interface JobAction {
  payload: ResponseOptions;
}

export default {
  jobs: handleActions(
    {
      [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (state: any, action: JobAction) =>
        immutable(state, {
          jobStatus: { $set: action.payload.status },
        }),
      [ActionTypes.GET_JOB_RESULT_SUCCESS]: (state: any, action: JobAction) =>
        immutable(state, {
          jobResultObjectId: { $set: action.payload.data.id },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state: any, action: JobAction) =>
        immutable(state, {
          jobId: { $set: action.payload.jobId },
        }),
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state: any) =>
        immutable(state, {
          jobStatus: { $set: STATUS.SUCCESS },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state: any) =>
        immutable(state, {
          jobStatus: { $set: STATUS.ERROR },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_JOB]: (state: any, action: JobAction) =>
        immutable(state, {
          jobId: { $set: action.payload.jobId },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_SUCCESS]: (state: any) =>
        immutable(state, {
          jobStatus: { $set: STATUS.SUCCESS },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_FAILURE]: (state: any) =>
        immutable(state, {
          jobStatus: { $set: STATUS.ERROR },
        }),
      [ActionTypes.CLEAR_JOB_ID]: (state: any) =>
        immutable(state, {
          jobId: { $set: '' },
        }),
      [ActionTypes.USER_LOGOUT]: () => initialJobState,
    },
    initialJobState,
  ),
};
