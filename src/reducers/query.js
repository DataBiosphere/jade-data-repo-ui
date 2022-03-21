import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { LOCATION_CHANGE } from 'connected-react-router';
import { ActionTypes, TABLE_DEFAULT_ROWS_PER_PAGE } from 'constants/index';
import BigQuery from 'modules/bigquery';
import { reduce, rest } from 'lodash';

export const queryState = {
  baseQuery: '',
  columns: null,
  delay: false,
  errMsg: '',
  error: false,
  filterData: {},
  filterStatement: '',
  joinStatement: '',
  pageSize: 0,
  projectId: '',
  queryParams: {},
  rows: null,
  orderProperty: '',
  orderDirection: '',
  polling: false,
  resultsCount: 0,
  page: 0,
  rowsPerPage: TABLE_DEFAULT_ROWS_PER_PAGE,
};

export default {
  query: handleActions(
    {
      [ActionTypes.RUN_QUERY_SUCCESS]: (state, action) => {
        const bigquery = new BigQuery();
        const queryResults = action.results.data;

        const columns = bigquery.transformColumns(queryResults);
        const rows = bigquery.transformRows(queryResults, columns);
        const queryParams = {
          pageToken: queryResults.pageToken,
          projectId: queryResults.jobReference.projectId,
          jobId: queryResults.jobReference.jobId,
          totalRows: queryResults.totalRows,
        };
        return immutable(state, {
          queryParams: { $set: queryParams },
          columns: { $set: columns },
          rows: { $set: rows },
          polling: { $set: false },
          delay: { $set: false },
          page: { $set: 0 },
        });
      },
      [ActionTypes.PREVIEW_DATA_SUCCESS]: (state, action) => {
        const queryResults = action.payload.queryResults.data.result;

        // TODO - I think we actually want the BQ to conform to this format
        const columns = action.payload.columns.map((column) => ({
          id: column.name,
          label: column.name,
          minWidth: 100,
          type: column.datatype,
          mode: column.array_of ? 'REPEATED' : 'NULLABLE',
        }));
        // TODO - this is pretty gross. Rework for both BQ & here.
        const rows = queryResults.map((row) => {
          const res = {};
          columns.forEach((col) => {
            res[col.id] = row[col.id];
          });
          res.datarepo_id = row.datarepo_row_id;
          return res;
        });
        // TODO - this is pretty gross. Rework for both BQ & here.
        let rows = queryResults.map(row => {
          const res = {};
          columns.forEach(col => {
            res[col.id] = row[col.id];
          })
          res.datarepo_id = row['datarepo_row_id'];
          return res;
        })
        console.log(rows);
        const queryParams = {
          totalRows: action.payload.totalRowCount,
        };

        return immutable(state, {
          error: { $set: false },
          queryParams: { $set: queryParams },
          columns: { $set: columns },
          rows: { $set: rows },
          polling: { $set: false },
          delay: { $set: false },
          resultsCount: { $set: queryResults.length },
        });
      },
      [ActionTypes.PAGE_QUERY_SUCCESS]: (state, action) => {
        const bigquery = new BigQuery();
        const queryResults = action.results.data;

        const columns = bigquery.transformColumns(queryResults);
        const rows = bigquery.transformRows(queryResults, columns);
        const queryParams = {
          pageToken: queryResults.pageToken,
          projectId: queryResults.jobReference.projectId,
          jobId: queryResults.jobReference.jobId,
          totalRows: queryResults.totalRows,
        };

        return immutable(state, {
          queryParams: { $set: queryParams },
          columns: { $set: columns },
          rows: { $set: rows },
        });
      },
      [ActionTypes.RUN_QUERY]: (state) =>
        immutable(state, {
          queryParams: { $set: {} },
          polling: { $set: true },
        }),
      [ActionTypes.POLL_QUERY]: (state) =>
        immutable(state, {
          delay: { $set: true },
        }),
      [ActionTypes.PREVIEW_DATA]: (state) =>
        immutable(state, {
          error: { $set: false },
          queryParams: { $set: {} },
          polling: { $set: true },
        }),
      [ActionTypes.PREVIEW_DATA_FAILURE]: (state, action) =>
        immutable(state, {
          error: { $set: true },
          errorMsg: { $set: action.payload },
          polling: { $set: false },
        }),
      [ActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action) =>
        immutable(state, {
          page: { $set: 0 },
          rowsPerPage: { $set: action.payload },
        }),
      [ActionTypes.CHANGE_PAGE]: (state, action) =>
        immutable(state, {
          page: { $set: action.payload },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action) => {
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
          page: { $set: 0 },
        });
      },
      [ActionTypes.APPLY_SORT]: (state, action) =>
        immutable(state, {
          orderProperty: { $set: action.payload.property },
          orderDirection: { $set: action.payload.direction },
        }),
      [LOCATION_CHANGE]: (state, action) => {
        if (action.payload.location.pathname.includes('/datasets/details/')) {
          // michael can you help us with this
          return immutable(state, {
            filterData: { $set: {} },
            filterStatement: { $set: '' },
            joinStatement: { $set: '' },
            queryParams: { $set: {} },
            polling: { $set: false },
          });
        }
        return state;
      },
      [ActionTypes.COUNT_RESULTS_SUCCESS]: (state, action) =>
        immutable(state, {
          resultsCount: { $set: action.resultsCount },
        }),
      [ActionTypes.USER_LOGOUT]: () => queryState,
    },
    queryState,
  ),
};
