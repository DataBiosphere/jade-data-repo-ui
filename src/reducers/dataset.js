import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const datasetState = {
  datasets: [],
};

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action) => {
        return immutable(state, {
          datasets: { $set: action.datasets.data.data },
        });
      },
    },
    datasetState,
  ),
};
