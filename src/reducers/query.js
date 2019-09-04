import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const queryState = {
  queryResults: {},
  filterData: {},
};

export default {
  query: handleActions(
    {
      [ActionTypes.RUN_QUERY_SUCCESS]: (state, action) =>
        immutable(state, {
          queryResults: { $set: action.results.data },
        }),
      [ActionTypes.RUN_QUERY]: state =>
        immutable(state, {
          queryResults: { $set: {} },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action) =>
        immutable(state, {
          filterData: { $set: action },
        }),
    },
    queryState,
  ),
};
