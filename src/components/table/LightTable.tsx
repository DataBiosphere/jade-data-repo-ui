import React, { useState, useEffect } from 'react';
import { ClassNameMap, withStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { applySort, changePage, changeRowsPerPage } from 'actions/index';
import { connect } from 'react-redux';
import { CustomTheme } from '@mui/material/styles';

import clsx from 'clsx';
import LightTableHead from './LightTableHead';
import LoadingSpinner from '../common/LoadingSpinner';
import { AppDispatch } from '../../store';
import { TableColumnType, TableRowType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';

const styles = (theme: CustomTheme) => ({
  root: {
    border: `1px solid ${theme.palette.lightTable.borderColor}`,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    boxShadow: 'none',
    // overflowX: 'auto',
    width: '100%',
    // overflowWrap: 'break-word',
  },
  table: {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    minWidth: 700,
  },
  row: {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  },
  cell: {
    borderBottom: `1px solid ${theme.palette.lightTable.bottomColor}`,
  },
  lightRow: {
    backgroundColor: theme.palette.lightTable.callBackgroundLight,
  },
  darkRow: {
    backgroundColor: theme.palette.lightTable.cellBackgroundDark,
  },
  paginationButton: {
    borderRadius: `${theme.shape.borderRadius}px`,
    margin: '0px 2px',
    // transition: null,
    padding: '0.25rem',
    border: `1px solid ${theme.palette.lightTable.paginationBlue}`,
    color: theme.palette.lightTable.paginationBlue,
  },
});

const DEFAULT_PAGE_SIZE = 10;
const ROW_HEIGHT = 50;
const ROWS_PER_PAGE = [5, 10, 25];

type LightTableProps = {
  classes: ClassNameMap;
  columns: Array<TableColumnType>;
  dispatch: AppDispatch;
  filteredCount: number;
  handleEnumeration: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
  ) => void;
  itemType: string;
  loading: boolean;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
  pageBQQuery?: () => void;
  rowKey: (row: object) => string;
  rows: Array<TableRowType>;
  searchString: string;
  summary: boolean;
  totalCount: number;
};

function LightTable({
  classes,
  columns,
  dispatch,
  filteredCount,
  handleEnumeration,
  itemType,
  loading,
  orderDirection,
  orderProperty,
  pageBQQuery,
  rowKey,
  rows,
  searchString,
  summary,
  totalCount,
}: LightTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [emptyRows, setEmptyRows] = useState(
    rowsPerPage < filteredCount
      ? rowsPerPage - Math.min(rowsPerPage, filteredCount - page * rowsPerPage)
      : 0,
  );

  const handleRequestSort = (_event: any, sort: string) => {
    let newOrder = 'desc';
    if (orderProperty === sort && orderDirection === 'desc') {
      newOrder = 'asc';
    }
    dispatch(applySort(sort, newOrder));
  };

  const handleChangeRowsPerPage = async (event: any) => {
    const limit = event.target.value;
    setRowsPerPage(limit);

    // Dispatching for JadeTable Combo
    const newRowsPerPage = parseInt(limit, 10);
    await dispatch(changeRowsPerPage(newRowsPerPage));
    if (pageBQQuery) {
      pageBQQuery();
    }
  };

  const handleChangePage = async (_event: any, newPage: number) => {
    // TODO - conver this to use redux state
    setPage(newPage);

    // Dispatching page change to store for JadeTable Combo
    // Once we no longer need to support BQ Querying,
    // we can remove the async/await call and pageBQQuery()
    await dispatch(changePage(newPage));
    if (pageBQQuery) {
      pageBQQuery();
    }
  };

  useEffect(() => {
    setEmptyRows(
      rowsPerPage < filteredCount
        ? rowsPerPage - Math.min(rowsPerPage, filteredCount - page * rowsPerPage)
        : 0,
    );
  }, [setEmptyRows, rowsPerPage, filteredCount, page]);

  useEffect(() => {
    handleEnumeration(rowsPerPage, page * rowsPerPage, orderProperty, orderDirection, searchString);
  }, [searchString, page, rowsPerPage, handleEnumeration, orderProperty, orderDirection]);

  return (
    <div>
      {!loading && (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <LightTableHead columns={columns} onRequestSort={handleRequestSort} summary={summary} />
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map((row, index) => {
                  const darkRow = index % 2 !== 0;
                  return (
                    <TableRow
                      key={rowKey ? rowKey(row) : row.name}
                      className={clsx({
                        [classes.row]: true,
                        [classes.darkRow]: darkRow,
                        [classes.lightRow]: !darkRow,
                      })}
                    >
                      {columns.map((col) => (
                        <TableCell
                          className={classes.cell}
                          key={col.name}
                          style={{ wordBreak: 'break-word' }}
                        >
                          {col.render ? col.render(row) : row[col.name]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className={classes.row}>
                  {filteredCount < totalCount ? (
                    <TableCell colSpan={columns.length}>No {itemType} match your filter</TableCell>
                  ) : (
                    <TableCell colSpan={columns.length}>
                      No {itemType} have been created yet
                    </TableCell>
                  )}
                </TableRow>
              )}
              {rows && emptyRows > 0 && rows.length < rowsPerPage && (
                <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                  <TableCell colSpan={columns.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          {!summary && rows && filteredCount > rowsPerPage && (
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE}
              component="div"
              count={filteredCount}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
                disableTouchRipple: true,
                disableFocusRipple: true,
                disableRipple: true,
                className: classes.paginationButton,
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
                disableTouchRipple: true,
                disableFocusRipple: true,
                disableRipple: true,
                className: classes.paginationButton,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => {
                if (count === totalCount) {
                  return `${from}-${to} of ${count}`;
                }
                return `${from}-${to} of ${count} filtered, ${totalCount} total`;
              }}
            />
          )}
        </Paper>
      )}
      {loading && <LoadingSpinner delay={false} delayMessage="" />}
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(LightTable));
