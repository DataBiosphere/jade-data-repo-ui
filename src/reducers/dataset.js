import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const datasetState = {
  dataset: {},
  datasets: [],
  previewDataset: [],
};

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action) => {
        return immutable(state, {
          datasets: { $set: action.datasets.data.data },
        });
      },
      [ActionTypes.DATASET_CREATE_SUCCESS]: (state, action) => {
        return immutable(state, {
          previewDataset: { $set: action.payload.data.data },
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
