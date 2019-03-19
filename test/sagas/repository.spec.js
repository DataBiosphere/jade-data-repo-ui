import { expectSaga } from 'redux-saga-test-plan';

import repository, { getDatasets, getStudies } from 'sagas/repository';
import { ActionTypes } from 'constants/index';

jest.mock('axios', () => ({
  get: () => ({ items: [] }),
}));

describe('repository', () => {
  it('should have the expected watchers', done =>
    expectSaga(repository)
      .run({ silenceTimeout: true })
      .then(() => {
        done();
      }));

  it('should have the get datasets saga', () =>
    expectSaga(getDatasets)
      .put({
        type: ActionTypes.GET_DATASETS_SUCCESS,
        datasets: {
          data: { items: [] },
        },
      })
      .run());

  it('should have the get studies saga', () =>
    expectSaga(getStudies)
      .put({
        type: ActionTypes.GET_STUDIES_SUCCESS,
        studies: {
          data: { items: [] },
        },
      })
      .run());
});
