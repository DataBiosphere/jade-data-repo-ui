import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const datasetState = {
  createdDataset: {},
  dataset: {},
  datasets: [],
  exception: false,
  datasetPolicies: [],
  study: {},
};

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action) =>
        immutable(state, {
          datasets: { $set: action.datasets.data.data },
        }),
      [ActionTypes.CREATE_DATASET_SUCCESS]: (state, action) =>
        immutable(state, {
          createdDataset: { $set: action.payload.jobResult },
        }),
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          dataset: { $set: action.dataset.data.data },
        }),
      [ActionTypes.GET_DATASET_POLICY_SUCCESS]: (state, action) =>
        immutable(state, {
          datasetPolicies: { $set: action.dataset.data.data.policies },
        }),
      [ActionTypes.EXCEPTION]: state =>
        immutable(state, {
          exception: { $set: true },
        }),
    },
    datasetState,
  ),
};
