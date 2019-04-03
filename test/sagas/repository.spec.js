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
  post: () => ({ data: { id: 'keep me posted', job_status: 'succeeded' } }),
}));

describe('repository', () => {
  it('test token expiration', () => {
    const tokenExpiration = 1553537329627;
    const dispatched = [];
    const test = runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ user: { tokenExpiration } }),
      },
      checkToken,
    );
    expect(test.result()).toBe(true);
  });

  it('test token invalid', () => {
    const tokenExpired = moment() - 360000;
    const dispatched = [];
    const test = runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ user: { tokenExpired } }),
      },
      checkToken,
    );
    expect(test.result()).toBe(false);
  });

  it('test get with auth header', () => {
    const token = 'Cherlene';
    const tokenExpiration = 1553537329627;
    const dispatched = [];
    const test = runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ user: { token, tokenExpiration } }),
      },
      authGet,
    );
    expect(test.result()).toEqual({ data: { job_status: 'succeeded' } });
  });

  it('test post with auth header', () => {
    const token = 'Cherlene';
    const tokenExpiration = 1553537329627;
    const dispatched = [];
    const test = runSaga(
      {
        dispatch: action => dispatched.push(action),
        getState: () => ({ user: { token, tokenExpiration } }),
      },
      authPost,
    );
    expect(test.result()).toEqual({ data: { id: 'keep me posted', job_status: 'succeeded' } });
  });

  it('should have the create dataset saga', () => {
    const token = 'Cherlene';
    const tokenExpiration = 1553537329627;
    const payload = {};
    expectSaga(createDataset, { payload })
      .provide([[select(getTokenExpiration), tokenExpiration], [select(getToken), token]])
      .put({
        type: ActionTypes.CREATE_DATASET_JOB,
        payload: {
          data: { data: { id: 'keep me posted', job_status: 'succeeded' } },
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
    const tokenExpiration = 1553537329627;
    expectSaga(getDatasets)
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
    const tokenExpiration = 1553537329627;
    const payload = {};
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
    const tokenExpiration = 1553537329627;
    expectSaga(getStudies)
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
    const tokenExpiration = 1553537329627;
    const payload = {};
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
