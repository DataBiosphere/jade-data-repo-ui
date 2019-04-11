import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const datasetState = {
  dataset: {},
  datasets: [],
  createdDataset: {},
  study: {},
};

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action) => {
        return immutable(state, {
          datasets: { $set: action.datasets.data.data },
        });
      },
      [ActionTypes.CREATE_DATASET_SUCCESS]: (state, action) => {
        return immutable(state, {
          createdDataset: { $set: action.payload.jobResult },
        });
      },
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state, action) => {
        return immutable(state, {
          dataset: { $set: action.dataset.data.data },
        });
      },
    },
    datasetState,
  ),
};
