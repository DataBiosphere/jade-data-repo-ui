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
  orderBy: '',
};

export default {
  query: handleActions(
    {
      [ActionTypes.RUN_QUERY_SUCCESS]: (state, action) => {
        const bigquery = new BigQuery();
        const queryResults = action.results.data;

        const columns = bigquery.transformColumns(queryResults);
        const rows = bigquery.transformRows(queryResults, columns);

        return immutable(state, {
          queryResults: { $set: queryResults },
          columns: { $set: columns },
          rows: { $set: rows },
        });
      },
      [ActionTypes.PAGE_QUERY_SUCCESS]: (state, action) => {
        const bigquery = new BigQuery();
        const queryResults = action.results.data;

        const columns = bigquery.transformColumns(queryResults);
        const rows = bigquery.transformRows(queryResults, columns);

        return immutable(state, {
          queryResults: { $set: queryResults },
          columns: { $set: columns },
          rows: { $set: rows },
        });
      },
      [ActionTypes.RUN_QUERY]: state =>
        immutable(state, {
          queryResults: { $set: {} },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action) => {
        const bigquery = new BigQuery();
        const filterStatement = bigquery.buildFilterStatement(action.payload);

        return immutable(state, {
          filterData: { $set: action.payload },
          filterStatement: { $set: filterStatement },
        });
      },
      [ActionTypes.APPLY_SORT]: (state, action) => {
        const bigquery = new BigQuery();
        const orderBy = bigquery.buildOrderBy(action.payload.property, action.payload.direction);

        return immutable(state, {
          orderBy: { $set: orderBy },
        });
      },
    },
    queryState,
  ),
};
