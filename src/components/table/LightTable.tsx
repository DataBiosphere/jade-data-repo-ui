import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { ClassNameMap, withStyles } from '@mui/styles';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { applySort, resizeColumn, changePage, changeRowsPerPage } from 'actions/index';
import { connect } from 'react-redux';
import { CustomTheme } from '@mui/material/styles';
import { Property } from 'csstype';
import clsx from 'clsx';

import LightTableHead from './LightTableHead';
import LoadingSpinner from '../common/LoadingSpinner';
import { AppDispatch } from '../../store';
import { TableColumnType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';
import { TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS, TABLE_DEFAULT_SORT_ORDER } from '../../constants';

const styles = (theme: CustomTheme) => ({
  root: {
    boxShadow: 'none',
    maxHeight: '100%',
    position: 'relative' as Property.Position,
  },
  tableWrapper: {
    border: `1px solid ${theme.palette.lightTable.borderColor}`,
    maxHeight: 'calc(100vh - 325px)',
    overflow: 'auto',
    backgroundColor: theme.palette.lightTable.cellBackgroundDark,
  },
  nullValue: {
    fontStyle: 'italic',
    textColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  },
  dialogContentText: {
    maxWidth: '800px',
    maxHeight: '80vh',
  },
  seeMoreLink: {
    ...theme.mixins.jadeLink,
    cursor: 'pointer',
  },
  valueDialogSeparator: {
    border: 'none',
    borderBottom: `1px solid ${theme.palette.primary.dark}`,
    width: '100%',
  },
  table: {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  },
  nonResizableTable: {
    tableLayout: 'fixed' as Property.TableLayout,
  },
  overlaySpinner: {
    opacity: 0.6,
    position: 'absolute' as Property.Position,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 'initial',
    height: 'initial',
    backgroundColor: theme.palette.common.white,
    zIndex: 100,
  },
  row: {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    '&:last-child td': {
      borderBottom: 'none',
    },
  },
  cell: {
    borderRight: `1px solid ${theme.palette.lightTable.borderColor}`,
    borderBottom: `1px solid ${theme.palette.lightTable.borderColor}`,
    '&:last-child': {
      borderRight: 'none',
    },
  },
  cellArrayWrapper: {
    display: 'flex',
  },
  // Typescript coaxing to combine the ellipsis mixin with other CSS properties
  // eslint-disable-next-line prefer-object-spread
  cellArrayContent: Object.assign({ flexGrow: 1 }, theme.mixins.ellipsis),
  cellContent: {
    ...theme.mixins.ellipsis,
  },
  lightRow: {
    backgroundColor: theme.palette.lightTable.callBackgroundLight,
  },
  darkRow: {
    backgroundColor: theme.palette.lightTable.cellBackgroundDark,
  },
  paginationWrapper: {
    border: `1px solid ${theme.palette.lightTable.borderColor}`,
    borderTop: 'none',
  },
  paginationButton: {
    borderRadius: `${theme.shape.borderRadius}px`,
    margin: '0px 2px',
    padding: '0.25rem',
    border: `1px solid ${theme.palette.lightTable.paginationBlue}`,
    color: theme.palette.lightTable.paginationBlue,
  },
});

// type RowType = TableRowType | DatasetSummaryModel | SnapshotSummaryModel;

type LightTableProps<RowType> = {
  classes: ClassNameMap;
  columns: Array<TableColumnType>;
  dispatch: AppDispatch;
  delay: boolean;
  filteredCount: number;
  handleEnumeration?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  infinitePaging?: boolean;
  loading: boolean;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
  noRowsMessage: string;
  page: number;
  pageBQQuery?: () => void;
  rows: Array<RowType>;
  rowsPerPage: number;
  rowKey?: string;
  searchString?: string;
  tableName?: string;
  totalCount?: number;
  refreshCnt: number;
};

function LightTable({
  classes,
  columns,
  delay,
  dispatch,
  filteredCount,
  handleEnumeration,
  infinitePaging,
  loading,
  noRowsMessage,
  orderDirection,
  orderProperty,
  page,
  pageBQQuery,
  rows,
  rowsPerPage,
  rowKey,
  searchString,
  tableName,
  totalCount,
  refreshCnt,
}: LightTableProps<object>) {
  const [seeMore, setSeeMore] = useState({ open: false, title: '', contents: [''] });

  const handleRequestSort = (_event: any, sort: string) => {
    let newOrder = TABLE_DEFAULT_SORT_ORDER;
    if (orderProperty === sort && orderDirection === 'asc') {
      newOrder = 'desc';
    }
    dispatch(applySort(sort, newOrder));
  };

  const handleResizeColumn = (_event: any, column: string, width: number) => {
    dispatch(resizeColumn(column, width));
  };

  const handleChangeRowsPerPage = async (event: any) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    await dispatch(changeRowsPerPage(newRowsPerPage));
    if (pageBQQuery) {
      pageBQQuery();
    }
  };

  // Once we no longer need to support BQ Querying,
  // we can remove the async/await call and pageBQQuery()
  const handleChangePage = async (_event: any, newPage: number) => {
    await dispatch(changePage(newPage));
    if (pageBQQuery) {
      pageBQQuery();
    }
  };

  const handleSeeMoreOpen = (values: Array<any>, title: string) => {
    setSeeMore({
      open: true,
      title,
      contents: values,
    });
  };

  const handleSeeMoreClose = () => {
    setSeeMore({
      open: false,
      title: '',
      contents: [''],
    });
  };

  const handleNullValue = () => <span className={classes.nullValue}>(empty)</span>;

  const handleRepeatedValues = (values: Array<string>, columnName: string) => {
    const cleanValues = values
      .map((v) => (_.isNil(v) ? handleNullValue() : `${v}`))
      .map((v, i) => <span key={`val-${i}`}>{v}</span>);

    const cellValues = cleanValues
      .map((v, i) => [v, <span key={`sep-${i}`}>, </span>])
      .flatMap((v) => v)
      .slice(0, -1);

    const dialogValues = cleanValues
      .map((v, i) => [v, <hr key={`sep-${i}`} className={classes.valueDialogSeparator} />])
      .flatMap((v) => v)
      .slice(0, -1);

    const seeMoreLink = (
      <Link key="see-more" onClick={() => handleSeeMoreOpen(dialogValues, columnName)}>
        <span className={classes.seeMoreLink}>
          ({cleanValues.length} {cleanValues.length === 1 ? 'item' : 'items'})
        </span>
      </Link>
    );

    return (
      <span className={classes.cellArrayWrapper}>
        <span className={classes.cellArrayContent}>{cellValues}</span>
        {seeMoreLink}
      </span>
    );
  };

  const handleValues = (row: object, column: TableColumnType) => {
    const value = row[column.name as keyof object];
    if (column.render) {
      return column.render(row);
    }
    if (_.isArray(value)) {
      if (column.arrayOf) {
        return handleRepeatedValues(value as Array<string>, column.name);
      }
      const singleValue = value[0];
      return _.isNil(singleValue) ? handleNullValue() : `${singleValue}`;
    }
    if (_.isNil(value)) {
      return handleNullValue();
    }
    return `${value}`;
  };

  // Not including handleEnumeration in effect list since we don't want a change in the function to trigger a fetch
  useEffect(() => {
    if (handleEnumeration) {
      handleEnumeration(
        rowsPerPage,
        page * rowsPerPage,
        orderProperty,
        orderDirection,
        searchString || '',
        refreshCnt,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, page, rowsPerPage, orderProperty, orderDirection, tableName, refreshCnt]);

  const supportsResize = columns.some((col) => col.allowResize);
  const tableWidth: number = columns.reduce(
    (agg, column) => agg + (_.isNumber(column.width) ? column.width : NaN),
    0,
  );
  const effectiveTableWidth = _.isNaN(tableWidth) || !supportsResize ? '100%' : tableWidth;
  const showPagination = (rows && rows.length > 0) || infinitePaging;

  return (
    <div>
      {!(loading && !rows?.length) && (
        <Paper className={classes.root}>
          {loading && (
            <LoadingSpinner
              delay={delay}
              delayMessage="For large datasets, it can take a few minutes to fetch results. Thank you for your patience."
              className={classes.overlaySpinner}
            />
          )}
          <TableContainer className={classes.tableWrapper}>
            <Table
              className={clsx(classes.table, { [classes.nonResizableTable]: !supportsResize })}
              stickyHeader
              sx={{ width: effectiveTableWidth }}
            >
              <LightTableHead
                columns={columns}
                onRequestSort={handleRequestSort}
                onResizeColumn={handleResizeColumn}
              />
              <TableBody data-cy="tableBody">
                {rows && rows.length > 0 ? (
                  rows.map((row: any, index) => {
                    const darkRow = index % 2 !== 0;
                    return (
                      <TableRow
                        hover
                        key={`${index}-${row[rowKey || 'id']}}`}
                        className={clsx({
                          [classes.row]: true,
                          [classes.darkRow]: darkRow,
                          [classes.lightRow]: !darkRow,
                        })}
                      >
                        {columns.map((col) => {
                          const maxWidth = _.isNumber(col.width) ? col.width : undefined;
                          return (
                            <TableCell
                              className={classes.cell}
                              key={`${col.name}-${index}`}
                              style={{ wordBreak: 'break-word' }}
                              data-cy={`cellValue-${col.name}-${index}`}
                            >
                              <div
                                className={classes.cellContent}
                                style={{ maxWidth, ...col.cellStyles }}
                              >
                                {handleValues(row, col)}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className={classes.row}>
                    <TableCell colSpan={columns.length}>{noRowsMessage}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {showPagination && (
            <TablePagination
              className={classes.paginationWrapper}
              rowsPerPageOptions={TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={filteredCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
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
                disabled: infinitePaging
                  ? rows.length < rowsPerPage
                  : page * rowsPerPage + rows.length >= filteredCount,
                className: classes.paginationButton,
              }}
              labelDisplayedRows={({ from, to, count }) => {
                if (infinitePaging) {
                  return `${from}-${Math.min(from + rows.length, to)}`;
                }
                if (count === totalCount) {
                  return `${from}-${to} of ${count}`;
                }
                return `${from}-${to} of ${count} filtered, ${totalCount} total`;
              }}
            />
          )}
          <Dialog open={seeMore.open} scroll="paper">
            <DialogTitle id="see-more-dialog-title">
              <Typography variant="h4" style={{ float: 'left' }}>
                {seeMore.title}
              </Typography>
              <IconButton size="small" style={{ float: 'right' }} onClick={handleSeeMoreClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers={true}>
              <DialogContentText
                className={classes.dialogContentText}
                component="div"
                id="see-more-dialog-content-text"
              >
                {seeMore.contents}
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Paper>
      )}
      {loading && !rows?.length && (
        <LoadingSpinner
          delay={delay}
          delayMessage="For large datasets, it can take a few minutes to fetch results. Thank you for your patience."
        />
      )}
    </div>
  );
}

function mapStateToProps(state: TdrState) {
  return {
    delay: state.query.delay,
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
    page: state.query.page,
    rowsPerPage: state.query.rowsPerPage,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(LightTable));
