import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from '../constants/index';

// Note: this is a subset of the full DUOS dataset object
// https://github.com/DataBiosphere/consent/blob/develop/src/main/resources/assets/schemas/Dataset.yaml
export interface DuosDatasetModel {
  dataSetId: number;
  datasetName: string;
  datasetIdentifier: string;
}
export interface DuosState {
  datasets: Array<DuosDatasetModel>;
  loading: boolean;
}

export const initialDuosState: DuosState = {
  datasets: [],
  loading: false,
};

export default {
  duos: handleActions(
    {
      [ActionTypes.GET_DUOS_DATASETS]: (state) =>
        immutable(state, {
          loading: { $set: true },
        }),
      [ActionTypes.GET_DUOS_DATASETS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          datasets: { $set: action.datasets.data.data },
          loading: { $set: false },
        }),
      [ActionTypes.GET_DUOS_DATASETS_FAILURE]: (state) =>
        immutable(state, {
          loading: { $set: false },
        }),
    },
    initialDuosState,
  ),
};
