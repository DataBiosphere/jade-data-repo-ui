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
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { applySort, changePage, changeRowsPerPage } from 'actions/index';
import { connect } from 'react-redux';
import { CustomTheme } from '@mui/material/styles';

import clsx from 'clsx';
import LightTableHead from './LightTableHead';
import LoadingSpinner from '../common/LoadingSpinner';
import { AppDispatch } from '../../store';
import { TableColumnType, TableRowType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';
// import { ellipsis } from '../../libs/styles';
import { TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS } from '../../constants';

const styles = (theme: CustomTheme) => ({
  root: {
    border: `1px solid ${theme.palette.lightTable.borderColor}`,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    boxShadow: 'none',
    maxHeight: '100%',
    overflow: 'auto',
  },
  tableWrapper: {
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  nullValue: {
    fontStyle: 'italic',
    textColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  },
  dialogContentText: {
    width: 'max-content',
    maxWidth: '800px',
  },
  seeMoreLink: {
    ...theme.mixins.jadeLink,
    cursor: 'pointer',
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
    // ...ellipsis,
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

const ROW_HEIGHT = 50;
const MAX_REPEATED_VALUES = 5;

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
  loading: boolean;
  orderDirection: OrderDirectionOptions;
  orderProperty: string;
  noRowsMessage: string;
  page: number;
  pageBQQuery?: () => void;
  rowKey: (row: TableRowType) => string;
  rows: Array<TableRowType>;
  rowsPerPage: number;
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
  loading,
  noRowsMessage,
  orderDirection,
  orderProperty,
  page,
  pageBQQuery,
  rowKey,
  rows,
  rowsPerPage,
  searchString,
  summary,
  totalCount,
}: LightTableProps) {
  const [seeMore, setSeeMore] = useState({ open: false, title: '', contents: [''] });
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

  const handleNullValue = () => <span className={classes.nullValue}>null</span>;

  const handleRepeatedValues = (values: Array<string>, columnName: string) => {
    const allValues = [];
    const cleanValues = values.map((v) => (_.isNull(v) ? handleNullValue() : v));
    const start = <span key="start">[</span>;
    const end = <span key="end">]</span>;
    for (let i = 0; i < cleanValues.length; i++) {
      const thisValue = cleanValues[i];
      if (i < cleanValues.length - 1) {
        allValues.push(
          <span key={`sep-${i}`}>
            {thisValue},<br />
          </span>,
        );
      } else {
        allValues.push(thisValue);
      }
    }
    const valuesToDisplay = [start, ...allValues, end];
    if (allValues.length > MAX_REPEATED_VALUES) {
      const ellipses = <span key="ellipses">...</span>;
      const seeMoreLink = (
        <span key="see-more">
          <Link
            className={classes.seeMoreLink}
            onClick={() => handleSeeMoreOpen(valuesToDisplay, columnName)}
          >
            <br />
            See all {allValues.length} values
          </Link>
        </span>
      );
      return [start, ...allValues.slice(0, MAX_REPEATED_VALUES), ellipses, end, seeMoreLink];
    }

    return valuesToDisplay;
  };

  const handleValues = (row: TableRowType, column: TableColumnType) => {
    const value = row[column.name];
    if (column.render) {
      return column.render(row);
    }
    if (_.isArray(value)) {
      if (column.arrayOf) {
        return handleRepeatedValues(value, column.name);
      }
      const singleValue = value[0];
      return _.isNull(singleValue) ? handleNullValue() : singleValue;
    }
    if (_.isNull(value)) {
      return handleNullValue();
    }
    return value;
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
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <LightTableHead
                columns={columns}
                onRequestSort={handleRequestSort}
                summary={summary}
              />
              <TableBody>
                {rows && rows.length > 0 ? (
                  rows.map((row, index) => {
                    const darkRow = index % 2 !== 0;
                    const rowKeyVal = rowKey ? rowKey(row) : row.name;
                    return (
                      <TableRow
                        key={rowKeyVal}
                        className={clsx({
                          [classes.row]: true,
                          [classes.darkRow]: darkRow,
                          [classes.lightRow]: !darkRow,
                        })}
                      >
                        {columns.map((col) => (
                          <TableCell
                            className={classes.cell}
                            key={`${col.name}-${rowKeyVal}`}
                            style={{ wordBreak: 'break-word' }}
                          >
                            {handleValues(row, col)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className={classes.row}>
                    <TableCell colSpan={columns.length}>{noRowsMessage}</TableCell>
                  </TableRow>
                )}
                {rows && emptyRows > 0 && rows.length < rowsPerPage && (
                  <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                    <TableCell colSpan={columns.length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {!summary && rows && (
            <TablePagination
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
                className: classes.paginationButton,
              }}
              labelDisplayedRows={({ from, to, count }) => {
                if (count === totalCount) {
                  return `${from}-${to} of ${count}`;
                }
                return `${from}-${to} of ${count} filtered, ${totalCount} total`;
              }}
            />
          )}
          <Dialog open={seeMore.open} scroll="paper">
            <DialogTitle /* disableTypography={true} */ id="see-more-dialog-title">
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
                id="see-more-dialog-content-text"
              >
                {seeMore.contents}
              </DialogContentText>
            </DialogContent>
          </Dialog>
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
    page: state.query.page,
    rowsPerPage: state.query.rowsPerPage,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(LightTable));
