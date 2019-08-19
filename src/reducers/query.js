import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';

export const queryState = {
  queryResults: {},
};

export default {
  query: handleActions(
    {
      [ActionTypes.RUN_QUERY_SUCCESS]: (state, action) =>
        immutable(state, {
          queryResults: { $set: action.results.data },
        }),
      [ActionTypes.GET_QUERY_RESULTS_SUCCESS]: (state, action) =>
        immutable(state, {
          queryResults: { $set: action.results.data },
        }),
    },
    queryState,
  ),
};
