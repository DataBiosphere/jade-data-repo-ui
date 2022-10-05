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
  jobsCount: number;
  filteredJobsCount: number;
  refreshCnt: number;
  loading: boolean;
}

export const initialJobState: JobState = {
  finished: '',
  jobId: '',
  jobStatus: Status.IDLE,
  jobResultObjectId: '',
  jobs: [],
  jobsCount: 0,
  filteredJobsCount: 0,
  refreshCnt: 0,
  loading: false,
};

interface ResponseOptions {
  status: Status;
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
      [ActionTypes.GET_JOBS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_JOBS_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
      [ActionTypes.GET_JOBS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          jobs: { $set: action.jobs.data.data },
          jobsCount: { $set: action.jobs.data.data.length },
          filteredJobsCount: { $set: action.jobs.data.data.length },
          loading: { $set: false },
        }),
      [ActionTypes.GET_JOB_BY_ID_SUCCESS]: (state, action: JobAction) =>
        immutable(state, {
          jobStatus: { $set: action.payload.status },
        }),
      [ActionTypes.GET_JOB_RESULT_SUCCESS]: (state, action: JobAction) =>
        immutable(state, {
          jobResultObjectId: { $set: action.payload.data.id },
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
