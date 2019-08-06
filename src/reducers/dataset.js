import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const datasetState = {
  datasets: [],
  dataset: {},
  datasetsCount: 0,
  datasetPolicies: [],
};

export default {
  datasets: handleActions(
    {
      [ActionTypes.GET_DATASETS_SUCCESS]: (state, action) =>
        immutable(state, {
          datasets: { $set: action.datasets.data.data.items },
          datasetsCount: { $set: action.datasets.data.data.total },
        }),
      [ActionTypes.GET_DATASET_BY_ID_SUCCESS]: (state, action) =>
        immutable(state, {
          dataset: { $set: action.dataset.data.data },
        }),
      [ActionTypes.GET_DATASET_POLICY_SUCCESS]: (state, action) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.ADD_CUSTODIAN_TO_DATASET_SUCCESS]: (state, action) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.REMOVE_CUSTODIAN_FROM_DATASET_SUCCESS]: (state, action) =>
        immutable(state, {
          datasetPolicies: { $set: action.policy.data.policies },
        }),
      [ActionTypes.CREATE_SNAPSHOT_JOB]: state =>
        immutable(state, {
          dataset: { $set: {} },
        }),
      [ActionTypes.GET_DATASET_TABLE_PREVIEW_SUCCESS]: (state, action) => {
        const i = state.dataset.schema.tables.findIndex(table => table.name === action.tableName);
        return immutable(state, {
          dataset: { schema: { tables: { [i]: { preview: { $set: action.preview.data.rows } } } } },
        });
      },
    },
    datasetState,
  ),
};
