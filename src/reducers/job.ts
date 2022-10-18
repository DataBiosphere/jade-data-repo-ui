import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { JobModel } from 'generated/tdr';

import { ActionTypes, Status } from '../constants';

export interface JobState {
  finished: string;
  jobId: string;
  jobStatus: Status;
  jobResultObjectId: string;
  jobs: Array<JobModel>;
  refreshCnt: number;
  loading: boolean;
  jobResult?: JobResult;
  jobResultLoading: boolean;
}

export enum JobResultType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface JobResult {
  resultType?: JobResultType;
  result?: JobResultError | any;
}
export interface JobResultError {
  message?: string;
  detail?: string[];
}

export const initialJobState: JobState = {
  finished: '',
  jobId: '',
  jobStatus: Status.IDLE,
  jobResultObjectId: '',
  jobs: [],
  refreshCnt: 0,
  loading: false,
  jobResult: {},
  jobResultLoading: false,
};

interface ResponseOptions {
  status: Status;
  jobId: string;
  data: {
    id: string;
    jobResult?: JobResult;
  };
}

interface JobAction {
  payload: ResponseOptions;
}

export default {
  jobs: handleActions(
    {
      [ActionTypes.GET_JOBS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_JOBS_FAILURE]: (state) =>
        immutable(state, {
          jobs: { $set: [] },
          loading: { $set: false },
        }),
      [ActionTypes.GET_JOBS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          jobs: { $set: action.jobs.data.data },
          loading: { $set: false },
        }),
      [ActionTypes.GET_JOB_RESULT]: (state) =>
        immutable(state, {
          jobResultLoading: { $set: true },
          jobResult: { $set: undefined },
        }),
      [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (state, action: JobAction) =>
        immutable(state, {
          jobStatus: { $set: action.payload.status },
        }),
      [ActionTypes.GET_JOB_RESULT_SUCCESS]: (state, action: JobAction) =>
        immutable(state, {
          jobResult: { $set: action.payload.data.jobResult },
          jobResultObjectId: { $set: action.payload.data.id },
          jobResultLoading: { $set: false },
        }),
      [ActionTypes.GET_JOB_RESULT_FAILURE]: (state) =>
        immutable(state, {
          jobResult: { $set: undefined },
          jobResultLoading: { $set: false },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: (state, action: JobAction) =>
        immutable(state, {
          jobId: { $set: action.payload.jobId },
        }),
      [ActionTypes.CREATE_SNAPSHOT_SUCCESS]: (state) =>
        immutable(state, {
          jobStatus: { $set: Status.SUCCESS },
        }),
      [ActionTypes.CREATE_SNAPSHOT_FAILURE]: (state) =>
        immutable(state, {
          jobStatus: { $set: Status.ERROR },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_JOB]: (state, action: JobAction) =>
        immutable(state, {
          jobId: { $set: action.payload.jobId },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_SUCCESS]: (state) =>
        immutable(state, {
          jobStatus: { $set: Status.SUCCESS },
        }),
      [ActionTypes.EXPORT_SNAPSHOT_FAILURE]: (state) =>
        immutable(state, {
          jobStatus: { $set: Status.ERROR },
        }),
      [ActionTypes.CLEAR_JOB_ID]: (state) =>
        immutable(state, {
          jobId: { $set: '' },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialJobState,
    },
    initialJobState,
  ),
};
