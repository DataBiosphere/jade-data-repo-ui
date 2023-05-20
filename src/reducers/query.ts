import { handleActions } from 'redux-actions';
import _ from 'lodash';
import immutable from 'immutability-helper';
import { LOCATION_CHANGE } from 'connected-react-router';
import { buildfilterStatement } from 'modules/filter';
import { CloudPlatform, ColumnModel, TableDataType } from 'generated/tdr';

import { ActionTypes, TABLE_DEFAULT_ROWS_PER_PAGE, TABLE_DEFAULT_COLUMN_WIDTH } from '../constants';

export type TableColumnType = {
  name: string;
  dataType?: string;
  arrayOf?: boolean;
  allowResize?: boolean;
  allowSort?: boolean;
  label: string;
  numeric?: boolean;
  render?: (row: object) => string | JSX.Element;
  width?: number | string;
  cellStyles?: any;
  originalValues?: ColumnValueType[]; // ColumnStats
  values?: ColumnValueType[]; // ColumnStats
  minValue?: number; // ColumnStats
  maxValue?: number; // ColumnStats
  isLoading?: boolean; // ColumnStats
  isExpanded?: boolean; // Filter panel
  filterHasUpdated?: boolean; // Filter panel
};

export type ColumnValueType = {
  value: string;
  count: number;
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
  errMsg: string;
  error: boolean;
  filterStatement: string;
  filterData: any;
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
  refreshCnt: number;
}

const defaultQueryParams = {
  totalRows: 0,
};

export const CHECKBOX_THRESHOLD = 30;

const formatDate = (value: number) =>
  !_.isNil(value)
    ? new Date(value * 1000).toLocaleString('en-US', { timeZoneName: 'short' })
    : null;

export const initialQueryState: QueryState = {
  baseQuery: '',
  columns: [],
  errMsg: '',
  error: false,
  filterData: {},
  filterStatement: '',
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
  refreshCnt: 0,
};

export default {
  query: handleActions(
    {
      [ActionTypes.PREVIEW_DATA_SUCCESS]: (state, action: any) => {
        const columnsByName = _.keyBy(state.columns, 'name');
        const columns: TableColumnType[] = action.payload.columns.map((column: ColumnModel) => ({
          ...columnsByName[column.name],
          name: column.name,
          dataType: column.datatype,
          arrayOf: column.array_of,
          allowSort: !column.array_of,
          allowResize: true,
          width: columnsByName[column.name]?.width || TABLE_DEFAULT_COLUMN_WIDTH,
          isLoading: false,
        }));
        // We only need to re-format row data of type timestamp
        const timestampColumns: TableColumnType[] = [];
        columns.forEach((col: TableColumnType) => {
          if (col.dataType === TableDataType.Timestamp) {
            timestampColumns.push(col);
          }
        });
        const rows = action.payload.queryResults.data.result.map((row: any) => {
          if (action.payload.cloudPlatform === CloudPlatform.Gcp) {
            timestampColumns.forEach((col: TableColumnType) => {
              if (col.arrayOf) {
                row[col.name] = row[col.name].map((v: number) => formatDate(v));
              } else {
                row[col.name] = formatDate(row[col.name]);
              }
            });
          }
          return row;
        });
        const queryParams = {
          totalRows: parseInt(action.payload.queryResults.data.totalRowCount, 10),
        };

        return immutable(state, {
          error: { $set: false },
          queryParams: { $set: queryParams },
          columns: { $set: columns },
          rows: { $set: rows },
          polling: { $set: false },
          resultsCount: { $set: parseInt(action.payload.queryResults.data.filteredRowCount, 10) },
        });
      },
      [ActionTypes.PREVIEW_DATA]: (state, action: any) =>
        immutable(state, {
          error: { $set: false },
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
      [ActionTypes.GET_COLUMN_STATS]: (state, action: any) => {
        const { columnName } = action.payload;
        const { columns } = state;
        const _columns = columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return { ...c, isLoading: true };
          }
          return c;
        });
        return immutable(state, {
          columns: { $set: _columns },
        });
      },
      [ActionTypes.COLUMN_STATS_FAILURE]: (state, action: any) => {
        const { columnName } = action.payload;
        const { columns } = state;
        const _columns = columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return { ...c, isLoading: false };
          }
          return c;
        });
        return immutable(state, {
          error: { $set: true },
          errMsg: { $set: action.payload },
          polling: { $set: false },
          columns: { $set: _columns },
        });
      },
      [ActionTypes.COLUMN_STATS_FILTERED_TEXT_SUCCESS]: (state, action: any) => {
        const { values } = action.payload.queryResults.data;
        const { columnName } = action.payload;
        const { columns } = state;
        const _columns = columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return { ...c, values, isLoading: false, filterHasUpdated: false };
          }
          return c;
        });
        return immutable(state, {
          error: { $set: false },
          columns: { $set: _columns },
          polling: { $set: false },
        });
      },
      [ActionTypes.COLUMN_STATS_TEXT_SUCCESS]: (state, action: any) => {
        const { values } = action.payload.queryResults.data;
        const { columnName } = action.payload;
        const { columns } = state;
        // counting on the idea that previewData has already been run
        // And, therefore state.columns should be populated
        // We're just adding the column stats onto the exisiting model
        const _columns = columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return {
              ...c,
              values,
              originalValues: values,
              isLoading: false,
            };
          }
          return c;
        });
        return immutable(state, {
          error: { $set: false },
          columns: { $set: _columns },
          polling: { $set: false },
        });
      },
      [ActionTypes.COLUMN_STATS_ALL_AND_FILTERED_TEXT_SUCCESS]: (state, action: any) => {
        const originalValues = action.payload.queryResults.data.values;
        const { values } = action.payload.filteredQueryResults.data;
        const { columnName } = action.payload;
        const { columns } = state;
        const _columns = columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return {
              ...c,
              values,
              originalValues,
              isLoading: false,
            };
          }
          return c;
        });
        return immutable(state, {
          error: { $set: false },
          columns: { $set: _columns },
          polling: { $set: false },
        });
      },
      [ActionTypes.COLUMN_STATS_NUMERIC_SUCCESS]: (state, action: any) => {
        const { minValue, maxValue } = action.payload.queryResults.data;
        const { columnName } = action.payload;
        const _columns = state.columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return { ...c, minValue, maxValue, isLoading: false, filterHasUpdated: false };
          }
          return c;
        });
        return immutable(state, {
          error: { $set: false },
          columns: { $set: _columns },
          polling: { $set: false },
        });
      },
      [ActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action: any) =>
        immutable(state, {
          page: { $set: 0 },
          rowsPerPage: { $set: action.payload },
        }),
      [ActionTypes.CHANGE_PAGE]: (state, action: any) =>
        immutable(state, {
          page: { $set: action.payload },
        }),
      [ActionTypes.RESIZE_COLUMN]: (state, action: any) =>
        immutable(state, {
          columns: {
            $set: state.columns.map((column) => {
              if (column.name === action.payload.property) {
                return { ...column, width: action.payload.width };
              }
              return column;
            }),
          },
        }),
      [ActionTypes.EXPAND_COLUMN_FILTER]: (state, action: any) => {
        const { columnName } = action.payload;
        const _columns = state.columns.map((c: TableColumnType) => {
          if (c.name === columnName) {
            return { ...c, isExpanded: !c.isExpanded };
          }
          return c;
        });
        return immutable(state, {
          columns: { $set: _columns },
        });
      },
      [ActionTypes.APPLY_FILTERS]: (state, action: any) => {
        const filterStatement = buildfilterStatement(action.payload.filters);
        const _columns = state.columns.map((c: TableColumnType) => {
          return { ...c, filterHasUpdated: true };
        });
        return immutable(state, {
          filterData: { $set: action.payload.filters },
          filterStatement: { $set: filterStatement },
          page: { $set: 0 },
          columns: { $set: _columns },
        });
      },
      [ActionTypes.APPLY_SORT]: (state, action: any) =>
        immutable(state, {
          page: { $set: 0 },
          orderProperty: { $set: action.payload.property },
          orderDirection: { $set: action.payload.direction },
        }),
      [ActionTypes.RESET_QUERY]: (state) =>
        immutable(state, {
          columns: { $set: [] },
          filterData: { $set: {} },
          filterStatement: { $set: '' },
          queryParams: { $set: defaultQueryParams },
          polling: { $set: false },
          page: { $set: 0 },
          orderProperty: { $set: '' },
          orderDirection: { $set: 'desc' },
        }),
      [LOCATION_CHANGE]: (state) =>
        immutable(state, {
          rows: { $set: [] },
          filterData: { $set: {} },
          filterStatement: { $set: '' },
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
