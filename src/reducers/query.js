import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { LOCATION_CHANGE } from 'connected-react-router';
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
  polling: false,
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
          polling: { $set: false },
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
          polling: { $set: true },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action) => {
        const bigquery = new BigQuery();
        const filterStatement = bigquery.buildFilterStatement(action.payload.filters);
        const joinStatement = bigquery.buildJoinStatement(
          action.payload.filters,
          action.payload.schema,
          action.payload.table,
          action.payload.dataset,
        );

        return immutable(state, {
          filterData: { $set: action.payload.filters },
          filterStatement: { $set: filterStatement },
          joinStatement: { $set: joinStatement },
        });
      },
      [ActionTypes.APPLY_SORT]: (state, action) => {
        const bigquery = new BigQuery();
        const orderBy = bigquery.buildOrderBy(action.payload.property, action.payload.direction);

        return immutable(state, {
          orderBy: { $set: orderBy },
        });
      },
      [LOCATION_CHANGE]: (state, action) => {
        if (!action.payload.location.pathname.includes('/query')) {
          return immutable(state, {
            filterData: { $set: {} },
            filterStatement: { $set: '' },
            joinStatement: { $set: '' },
            queryResults: { $set: {} },
            polling: { $set: false },
          });
        }
        return state;
      },
    },
    queryState,
  ),
};
