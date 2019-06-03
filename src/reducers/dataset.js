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
  datasetCount: 0,
};

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action) =>
        immutable(state, {
          datasets: { $set: action.datasets.data.data.items },
          datasetCount: { $set: action.datasets.data.data.total },
        }),
      [ActionTypes.CREATE_DATASET_JOB]: (state, action) => {
        const newDatasetCreation = {
          jobId: action.payload.jobId,
          dataset: action.payload.data.data,
          datasetRequest: action.payload.datasetRequest,
        };
        return immutable(state, {
          createdDatasets: { $push: [newDatasetCreation] },
          dataset: { $set: {} },
        });
      },
      [ActionTypes.CREATE_DATASET_SUCCESS]: (state, action) =>
        immutable(state, {
          dataset: { $set: action.payload.jobResult },
        }),
      [ActionTypes.CREATE_DATASET_FAILURE]: (state, action) => {
        const successfullyCreatedDatasets = state.createdDatasets; // passes a ref or a value?
        successfullyCreatedDatasets.filter(dataset => dataset.jobId !== action.payload.jobId);
        return immutable(state, {
          createdDatasets: { $set: successfullyCreatedDatasets },
        });
      },
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          dataset: { $set: action.dataset.data.data },
        }),
      [ActionTypes.GET_DATASET_POLICY_SUCCESS]: (state, action) =>
        immutable(state, {
          datasetPolicies: { $set: action.dataset.data.data.policies },
        }),
      [ActionTypes.ADD_READER_TO_DATASET_SUCCESS]: (state, action) =>
        immutable(state, {
          datasetPolicies: { $set: action.dataset.data.data.policies },
        }),
      [ActionTypes.REMOVE_READER_FROM_DATASET_SUCCESS]: (state, action) =>
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
