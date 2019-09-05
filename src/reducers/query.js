import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { ActionTypes } from 'constants/index';
import BigQuery from 'modules/bigquery';

export const queryState = {
  baseQuery: '',
  filterData: {},
  filterStatement: '',
  pageSize: 0,
  projectId: '',
  queryResults: {},
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
      [ActionTypes.APPLY_FILTERS]: (state, action) => {
        const bigquery = new BigQuery();
        const filterStatement = bigquery.buildFilterStatement(action.payload);

        console.log(state);
        console.log(action);

        return immutable(state, {
          filterData: { $set: action.payload },
          filterStatement: { $set: filterStatement },
        });
      },
    },
    queryState,
  ),
};
