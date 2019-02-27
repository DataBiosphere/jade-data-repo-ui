import { expectSaga } from 'redux-saga-test-plan';

import repository, { createDataset } from 'sagas/repository';
import { ActionTypes } from 'constants/index';

jest.mock('modules/client', () => ({
  request: () => ({ items: [] }),
}));

describe('repository', () => {
  it('should have the expected watchers', done =>
    expectSaga(repository)
      .run({ silenceTimeout: true })
      .then(saga => {
        expect(saga).toMatchSnapshot();
        done();
      }));

  it('should have the repos saga', () =>
    expectSaga(createDataset, { payload: { query: 'react' } })
      .put({
        type: ActionTypes.DATASET_CREATE_SUCCESS,
        payload: {
          data: [{ items: [] }],
        },
      })
      .run());
});
