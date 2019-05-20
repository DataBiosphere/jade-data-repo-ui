import { expectSaga } from 'redux-saga-test-plan';
import { runSaga } from 'redux-saga';
import { select } from 'redux-saga/effects';
import moment from 'moment';

import {
  authGet,
  authPost,
  checkToken,
  createDataset,
  getDatasets,
  getDatasetById,
  getStudies,
  getStudyById,
  getTokenExpiration,
  getToken,
} from 'sagas/repository';
import { ActionTypes } from 'constants/index';

jest.mock('axios', () => ({
  get: () => ({ data: { job_status: 'succeeded' } }),
  post: () => ({ data: { id: 'keepMePosted', job_status: 'succeeded' } }),
}));

const anHourFromNow = moment() + 360000;
const anHourBeforeNow = moment() - 360000;

describe('repository', () => {
  it('test token expiration', () => {
    const tokenExpiration = anHourFromNow;
    const test = runSaga(
      {
        getState: () => ({ user: { tokenExpiration } }),
      },
      checkToken,
    );
    expect(test.result()).toBe(true);
  });

  it('test token invalid', () => {
    const tokenExpired = anHourBeforeNow;
    const test = runSaga(
      {
        getState: () => ({ user: { tokenExpired } }),
      },
      checkToken,
    );
    expect(test.result()).toBe(false);
  });

  it('test get with auth header', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const test = runSaga(
      {
        getState: () => ({ user: { token, tokenExpiration } }),
      },
      authGet,
      '/api/repository/v1/datasets',
    );
    expect(test.result()).toEqual({ data: { job_status: 'succeeded' } });
  });

  it('test post with auth header', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const test = runSaga(
      {
        getState: () => ({ user: { token, tokenExpiration } }),
      },
      authPost,
      '/api/repository/v1/datasets',
      'params',
    );
    expect(test.result()).toEqual({ data: { id: 'keepMePosted', job_status: 'succeeded' } });
  });

  it('should have the create dataset saga', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const payload = {};
    expectSaga(createDataset, { payload })
      .provide([[select(getTokenExpiration), tokenExpiration], [select(getToken), token]])
      .put({
        type: ActionTypes.CREATE_DATASET_JOB,
        payload: {
          data: { data: { id: 'keepMePosted', job_status: 'succeeded' } },
          createdDataset: payload,
        },
      })
      .put({
        type: ActionTypes.CREATE_DATASET_SUCCESS,
        payload: { jobResult: { job_status: 'succeeded' } },
      })
      .run();
  });

  it('should have the get datasets saga', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const payload = {};
    expectSaga(getDatasets, { payload })
      .provide([[select(getTokenExpiration), tokenExpiration], [select(getToken), token]])
      .put({
        type: ActionTypes.GET_DATASETS_SUCCESS,
        datasets: {
          data: { data: { job_status: 'succeeded' } },
        },
      })
      .run();
  });

  it('should have the get dataset by id saga', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const payload = 'datasetId';
    expectSaga(getDatasetById, { payload })
      .provide([[select(getTokenExpiration), tokenExpiration], [select(getToken), token]])
      .put({
        type: ActionTypes.GET_DATASET_BY_ID_SUCCESS,
        dataset: {
          data: { data: { job_status: 'succeeded' } },
        },
      })
      .run();
  });

  it('should have the get studies saga', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const payload = {};
    expectSaga(getStudies, { payload })
      .provide([[select(getTokenExpiration), tokenExpiration], [select(getToken), token]])
      .put({
        type: ActionTypes.GET_STUDIES_SUCCESS,
        studies: {
          data: { data: { job_status: 'succeeded' } },
        },
      })
      .run();
  });

  it('should have the get study by id saga', () => {
    const token = 'Cherlene';
    const tokenExpiration = anHourFromNow;
    const payload = 'studyId';
    expectSaga(getStudyById, { payload })
      .provide([[select(getTokenExpiration), tokenExpiration], [select(getToken), token]])
      .put({
        type: ActionTypes.GET_STUDY_BY_ID_SUCCESS,
        study: {
          data: { data: { job_status: 'succeeded' } },
        },
      })
      .run();
  });
});
