import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { LOCATION_CHANGE } from 'connected-react-router';
import { ActionTypes } from '../constants';
import BigQuery from 'modules/bigquery';

export interface QueryState {
  baseQuery: string,
  delay: boolean,
  filterData: any,
  filterStatement: string,
  pageSize: number,
  projectId: string,
  queryResults: any,
  orderBy: string,
  polling: boolean,
  resultsCount: number,
}

export const initialQueryState: QueryState = {
  baseQuery: '',
  delay: false,
  filterData: {},
  filterStatement: '',
  pageSize: 0,
  projectId: '',
  queryResults: {},
  orderBy: '',
  polling: false,
  resultsCount: 0,
};

export default {
  query: handleActions(
    {
      [ActionTypes.RUN_QUERY_SUCCESS]: (state: any, action: any) => {
        const bigquery = new BigQuery();
        const queryResults = action.results.data;

        const columns = bigquery.transformColumns(queryResults);
        const rows = bigquery.transformRows(queryResults, columns);

        return immutable(state, {
          queryResults: { $set: queryResults },
          columns: { $set: columns },
          rows: { $set: rows },
          polling: { $set: false },
          delay: { $set: false },
        });
      },
      [ActionTypes.PAGE_QUERY_SUCCESS]: (state: any, action: any) => {
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
      [ActionTypes.RUN_QUERY]: (state: any) =>
        immutable(state, {
          queryResults: { $set: {} },
          polling: { $set: true },
        }),
      [ActionTypes.POLL_QUERY]: (state: any) =>
        immutable(state, {
          delay: { $set: true },
        }),
      [ActionTypes.APPLY_FILTERS]: (state: any, action: any) => {
        const bigquery = new BigQuery();
        const filterStatement = bigquery.buildFilterStatement(action.payload.filters);
        const joinStatement = bigquery.buildJoinStatement(
          action.payload.filters,
          action.payload.table,
          action.payload.dataset,
        );
        return immutable(state, {
          filterData: { $set: action.payload.filters },
          filterStatement: { $set: filterStatement },
          joinStatement: { $set: joinStatement },
        });
      },
      [ActionTypes.APPLY_SORT]: (state: any, action: any) => {
        const bigquery = new BigQuery();
        const orderBy = bigquery.buildOrderBy(action.payload.property, action.payload.direction);

        return immutable(state, {
          orderBy: { $set: orderBy },
        });
      },
      [LOCATION_CHANGE]: (state: any, action: any) => {
        if (action.payload.location.pathname.includes('/datasets/details/')) {
          // michael can you help us with this
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
      [ActionTypes.COUNT_RESULTS_SUCCESS]: (state: any, action: any) =>
        immutable(state, {
          resultsCount: { $set: action.resultsCount },
        }),
      [ActionTypes.USER_LOGOUT]: () => initialQueryState,
    },
    initialQueryState,
  ),
};
