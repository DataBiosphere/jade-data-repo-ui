import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';
import { LOCATION_CHANGE } from 'connected-react-router';
import BigQuery from 'modules/bigquery';
import { ColumnModel } from 'generated/tdr';

import { ActionTypes, TABLE_DEFAULT_ROWS_PER_PAGE } from '../constants';

export type TableColumnType = {
  name: string;
  dataType: string;
  arrayOf: boolean;
  allowSort: boolean;
  label: string;
  numeric: boolean;
  render: (row: object) => string;
};

export type TableRowType = {
  name: string;
  [column: string]: string;
};

export type OrderDirectionOptions = 'asc' | 'desc' | undefined;

// pageToken, projectId, and jobId are only needed for direct BQ Queries
export type QueryParams = {
  pageToken?: string;
  projectId?: string;
  jobId?: string;
  totalRows: number;
};

export interface QueryState {
  baseQuery: string;
  columns: Array<TableColumnType>;
  delay: boolean;
  errMsg: string;
  error: boolean;
  filterData: any;
  filterStatement: string;
  joinStatement: string;
  pageSize: number;
  projectId: string;
  queryParams: QueryParams;
  rows: Array<TableRowType>;
  orderProperty: string;
  orderDirection: OrderDirectionOptions;
  polling: boolean;
  resultsCount: number;
  page: number;
  rowsPerPage: number;
}

const defaultQueryParams = {
  totalRows: 0,
};

export const initialQueryState: QueryState = {
  baseQuery: '',
  columns: [],
  delay: false,
  errMsg: '',
  error: false,
  filterData: {},
  filterStatement: '',
  joinStatement: '',
  pageSize: 0,
  projectId: '',
  queryParams: defaultQueryParams,
  rows: [],
  orderProperty: '',
  orderDirection: undefined,
  polling: false,
  resultsCount: 0,
  page: 0,
  rowsPerPage: TABLE_DEFAULT_ROWS_PER_PAGE,
};

export default {
  query: handleActions(
    {
      [ActionTypes.RUN_QUERY_SUCCESS]: (state, action: any) => {
        const bigquery = new BigQuery();
        const queryResults = action.results.data;

        const columns = bigquery.transformColumns(queryResults);
        const rows = bigquery.transformRows(queryResults, columns);
        const queryParams = {
          pageToken: queryResults.pageToken,
          projectId: queryResults.jobReference.projectId,
          jobId: queryResults.jobReference.jobId,
          totalRows: parseInt(queryResults.totalRows, 10),
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
      [ActionTypes.PREVIEW_DATA_SUCCESS]: (state, action: any) => {
        const rows = action.payload.queryResults.data.result;
        const columns = action.payload.columns.map((column: ColumnModel) => ({
          name: column.name,
          dataType: column.datatype,
          arrayOf: column.array_of,
          allowSort: !column.array_of,
        }));
        const queryParams = {
          totalRows: parseInt(action.payload.totalRowCount, 10),
        };

        return immutable(state, {
          error: { $set: false },
          queryParams: { $set: queryParams },
          columns: { $set: columns },
          rows: { $set: rows },
          polling: { $set: false },
          delay: { $set: false },
          resultsCount: { $set: rows.length },
        });
      },
      [ActionTypes.PAGE_QUERY_SUCCESS]: (state, action: any) => {
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
          queryParams: { $set: defaultQueryParams },
          polling: { $set: true },
        }),
      [ActionTypes.POLL_QUERY]: (state) =>
        immutable(state, {
          delay: { $set: true },
        }),
      [ActionTypes.PREVIEW_DATA]: (state, action: any) =>
        immutable(state, {
          error: { $set: false },
          queryParams: { $set: defaultQueryParams },
          polling: { $set: true },
          orderProperty: { $set: action.payload.orderProperty },
          orderDirection: { $set: action.payload.orderDirection },
        }),
      [ActionTypes.PREVIEW_DATA_FAILURE]: (state, action: any) =>
        immutable(state, {
          error: { $set: true },
          errMsg: { $set: action.payload },
          polling: { $set: false },
        }),
      [ActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action: any) =>
        immutable(state, {
          page: { $set: 0 },
          rowsPerPage: { $set: action.payload },
        }),
      [ActionTypes.CHANGE_PAGE]: (state, action: any) =>
        immutable(state, {
          page: { $set: action.payload },
        }),
      [ActionTypes.APPLY_FILTERS]: (state, action: any) => {
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
      [ActionTypes.APPLY_SORT]: (state, action: any) =>
        immutable(state, {
          orderProperty: { $set: action.payload.property },
          orderDirection: { $set: action.payload.direction },
        }),
      [ActionTypes.RESET_QUERY]: (state) =>
        immutable(state, {
          filterData: { $set: {} },
          filterStatement: { $set: '' },
          joinStatement: { $set: '' },
          queryParams: { $set: defaultQueryParams },
          polling: { $set: false },
          page: { $set: 0 },
          orderProperty: { $set: '' },
          orderDirection: { $set: 'desc' },
        }),
      [LOCATION_CHANGE]: (state) =>
        immutable(state, {
          filterData: { $set: {} },
          filterStatement: { $set: '' },
          joinStatement: { $set: '' },
          queryParams: { $set: defaultQueryParams },
          polling: { $set: false },
          page: { $set: 0 },
          orderProperty: { $set: '' },
          orderDirection: { $set: 'desc' },
        }),
      [ActionTypes.COUNT_RESULTS_SUCCESS]: (state, action: any) =>
        immutable(state, {
          resultsCount: { $set: action.resultsCount },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: () => initialQueryState,
    },
    initialQueryState,
  ),
};
