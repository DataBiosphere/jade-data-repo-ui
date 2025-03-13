import React, { useState, useEffect } from 'react';
import _ from 'lodash';
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
  useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { applySort, resizeColumn, changePage, changeRowsPerPage } from 'actions/index';
import { connect } from 'react-redux';
import { CustomTheme, styled } from '@mui/material/styles';

import { AppDispatch } from 'src/store';
import LightTableHead from './LightTableHead';
import LoadingSpinner from '../common/LoadingSpinner';
import { TableColumnType, OrderDirectionOptions } from '../../reducers/query';
import { TdrState } from '../../reducers';
import { TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS, TABLE_DEFAULT_SORT_ORDER } from '../../constants';

const TableWrapper = styled(TableContainer)(({ theme }: { theme: CustomTheme }) => ({
  border: `1px solid ${theme.palette.lightTable.borderColor}`,
  maxHeight: 'calc(100vh - 325px)',
  overflow: 'auto',
  backgroundColor: theme.palette.lightTable.cellBackgroundDark,
}));

const NullValue = styled('span')(({ theme }) => ({
  fontStyle: 'italic',
  color: theme.palette.primary.dark,
}));

const DialogContentTextStyled = styled(DialogContentText)({
  maxWidth: '800px',
  maxHeight: '80vh',
});

const SeeMoreLink = styled(Link)(({ theme }: { theme: CustomTheme }) => ({
  ...theme.mixins.jadeLink,
  cursor: 'pointer',
}));

const ValueDialogSeparator = styled('hr')(({ theme }) => ({
  border: 'none',
  borderBottom: `1px solid ${theme.palette.primary.dark}`,
  width: '100%',
}));

const OverlaySpinner = styled(LoadingSpinner)(({ theme }) => ({
  opacity: 0.6,
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 'initial',
  height: 'initial',
  backgroundColor: theme.palette.common.white,
  zIndex: 100,
}));

const Row = styled(TableRow)(({ theme }) => ({
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  '&:last-child td': {
    borderBottom: 'none',
  },
}));

const Cell = styled(TableCell)(({ theme }: { theme: CustomTheme }) => ({
  borderRight: `1px solid ${theme.palette.lightTable.borderColor}`,
  borderBottom: `1px solid ${theme.palette.lightTable.borderColor}`,
  '&:last-child': {
    borderRight: 'none',
  },
}));

const CellArrayWrapper = styled('span')({
  display: 'flex',
});

const CellArrayContent = styled('span')(({ theme }: { theme: CustomTheme }) => ({
  flexGrow: 1,
  ...theme.mixins.ellipsis,
}));

const CellContent = styled('div')(({ theme }: { theme: CustomTheme }) => ({
  ...theme.mixins.ellipsis,
}));

const PaginationWrapper = styled(TablePagination)(({ theme }: { theme: CustomTheme }) => ({
  border: `1px solid ${theme.palette.lightTable.borderColor}`,
  borderTop: 'none',
}));

// type RowType = TableRowType | DatasetSummaryModel | SnapshotSummaryModel;

type LightTableProps<RowType> = {
  readonly columns: Array<TableColumnType>;
  readonly dispatch: AppDispatch;
  readonly filteredCount: number;
  readonly handleEnumeration?: (
    rowsPerPage: number,
    rowsForCurrentPage: number,
    orderProperty: string,
    orderDirection: OrderDirectionOptions,
    searchString: string,
    refreshCnt: number,
  ) => void;
  readonly infinitePaging?: boolean;
  readonly loading: boolean;
  readonly orderDirection: OrderDirectionOptions;
  readonly orderProperty: string;
  readonly noRowsMessage: string;
  readonly page: number;
  readonly rows: Array<RowType>;
  readonly rowsPerPage: number;
  readonly rowKey?: string;
  readonly searchString?: string;
  readonly tableName?: string;
  readonly totalCount?: number;
  readonly refreshCnt: number;
};

function LightTable<T>({
  columns,
  dispatch,
  filteredCount,
  handleEnumeration,
  infinitePaging,
  loading,
  noRowsMessage,
  orderDirection,
  orderProperty,
  page,
  rows,
  rowsPerPage,
  rowKey,
  searchString,
  tableName,
  totalCount,
  refreshCnt,
}: LightTableProps<T>) {
  const [seeMore, setSeeMore] = useState({ open: false, title: '', contents: [''] });

  const theme = useTheme() as CustomTheme;

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
  };

  const handleChangePage = async (_event: any, newPage: number) => {
    await dispatch(changePage(newPage));
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

  const handleNullValue = () => <NullValue key="emptyRow">(empty)</NullValue>;

  const handleRepeatedValues = (values: Array<string>, columnName: string) => {
    const cleanValues = _.isEmpty(values)
      ? [handleNullValue()]
      : values
          .map((v) => (_.isNil(v) ? handleNullValue() : `${v}`))
          .map((v, i) => <span key={`val-${i}`}>{v}</span>);

    const cellValues = cleanValues
      .map((v, i) => [v, <span key={`sep-${i}`}>, </span>])
      .flatMap((v) => v)
      .slice(0, -1);

    const dialogValues = cleanValues
      .map((v, i) => [v, <ValueDialogSeparator key={`sep-${i}`} />])
      .flatMap((v) => v)
      .slice(0, -1);

    return (
      <CellArrayWrapper>
        <CellArrayContent theme={theme}>{cellValues}</CellArrayContent>
        <SeeMoreLink
          key="see-more"
          onClick={() => handleSeeMoreOpen(dialogValues, columnName)}
          theme={theme}
        >
          ({cleanValues.length} {cleanValues.length === 1 ? 'item' : 'items'})
        </SeeMoreLink>
      </CellArrayWrapper>
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

  const paginationButtonStyles = {
    borderRadius: `${theme.shape.borderRadius}px`,
    margin: '0px 2px',
    padding: '0.25rem',
    border: `1px solid ${theme.palette.lightTable.paginationBlue}`,
    color: theme.palette.lightTable.paginationBlue,
  };

  return (
    <div>
      {!(loading && !rows?.length) && (
        <Paper
          sx={{
            boxShadow: 'none',
            maxHeight: '100%',
            position: 'relative',
          }}
        >
          {loading && <OverlaySpinner />}
          <TableWrapper theme={theme}>
            <Table
              stickyHeader
              sx={{
                width: effectiveTableWidth,
                borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
                tableLayout: supportsResize ? undefined : 'fixed',
              }}
            >
              <LightTableHead
                columns={columns}
                onRequestSort={handleRequestSort}
                onResizeColumn={handleResizeColumn}
              />
              <TableBody data-cy="tableBody">
                {rows && rows.length > 0 ? (
                  rows.map((row: any, index: number) => {
                    const darkRow = index % 2 !== 0;
                    return (
                      <Row
                        hover
                        key={`${index}-${row[rowKey || 'id']}}`}
                        sx={{
                          backgroundColor: darkRow
                            ? theme.palette.lightTable.cellBackgroundDark
                            : theme.palette.lightTable.callBackgroundLight,
                        }}
                      >
                        {columns.map((col) => {
                          const maxWidth = _.isNumber(col.width) ? col.width : undefined;
                          return (
                            <Cell
                              key={`${col.name}-${index}`}
                              style={{ wordBreak: 'break-word' }}
                              data-cy={`cellValue-${col.name}-${index}`}
                              theme={theme}
                            >
                              <CellContent style={{ maxWidth, ...col.cellStyles }} theme={theme}>
                                {handleValues(row, col)}
                              </CellContent>
                            </Cell>
                          );
                        })}
                      </Row>
                    );
                  })
                ) : (
                  <Row>
                    <Cell colSpan={columns.length} theme={theme}>
                      {noRowsMessage}
                    </Cell>
                  </Row>
                )}
              </TableBody>
            </Table>
          </TableWrapper>
          {showPagination && (
            <PaginationWrapper
              rowsPerPageOptions={TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS}
              component="div"
              theme={theme}
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
                sx: paginationButtonStyles,
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
                disableTouchRipple: true,
                disableFocusRipple: true,
                disableRipple: true,
                disabled: infinitePaging
                  ? rows.length < rowsPerPage
                  : page * rowsPerPage + rows.length >= filteredCount,
                sx: paginationButtonStyles,
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
              <Typography variant="h4" sx={{ float: 'left' }}>
                {seeMore.title}
              </Typography>
              <IconButton size="small" sx={{ float: 'right' }} onClick={handleSeeMoreClose}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers={true}>
              <DialogContentTextStyled id="see-more-dialog-content-text">
                {seeMore.contents}
              </DialogContentTextStyled>
            </DialogContent>
          </Dialog>
        </Paper>
      )}
      {loading && !rows?.length && <LoadingSpinner />}
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

export default connect(mapStateToProps)(LightTable);
