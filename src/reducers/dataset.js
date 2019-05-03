import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const datasetState = {
  createdDatasets: [],
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
        });
      },
      [ActionTypes.CREATE_DATASET_JOB]: (state, action) => {
        const newDatasetCreation = {
          jobId: action.payload.jobId,
          dataset: action.payload.data.data,
        };
        return immutable(state, {
          createdDatasets: { $push: [newDatasetCreation] },
        });
      },
      [ActionTypes.CREATE_DATASET_SUCCESS]: (state, action) => {
        return immutable(state, {
          dataset: { $set: action.payload.jobResult },
        });
      },
      [ActionTypes.CREATE_DATASET_FAILURE]: (state, action) => {
        let successfullyCreatedDatasets = state.createdDatasets; // passes a ref or a value?
        successfullyCreatedDatasets.filter(dataset => dataset.jobId !== action.payload.jobId);
        return immutable(state, {
          createdDatasets: { $set: successfullyCreatedDatasets },
        });
      },
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state, action) => {
        return immutable(state, {
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
