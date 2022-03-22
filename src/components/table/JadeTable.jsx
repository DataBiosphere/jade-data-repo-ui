import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import LoadingSpinner from 'components/common/LoadingSpinner';
import Failure from 'components/common/Failure';
import { changeRowsPerPage, changePage, applySort } from 'actions/index';
import JadeTableHead from './JadeTableHead';
import { ellipsis } from '../../libs/styles';
import { COLUMN_MODES, TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS } from '../../constants';

// eslint-disable-next-line no-unused-vars
const styles = (theme) => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    height: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
  cell: {
    borderBottomColor: theme.palette.lightTable.bottomColor,
    ...ellipsis,
  },
  nullValue: {
    fontStyle: 'italic',
    textColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  },
});

function JadeTable({
  allowSort,
  classes,
  columns,
  delay,
  dispatch,
  errMsg,
  error,
  orderDirection,
  page,
  polling,
  queryParams,
  rows,
  rowsPerPage,
  updateDataOnChange,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const c = parseInt(queryParams.totalRows, 10);
    if (c >= 0) {
      setCount(c);
    }
  }, [queryParams]);

  const handleChangePage = async (event, newPage) => {
    await dispatch(changePage(newPage));
    updateDataOnChange();
  };

  const handleChangeRowsPerPage = async (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    await dispatch(changeRowsPerPage(newRowsPerPage));
    updateDataOnChange();
  };

  const createSortHandler = (property) => {
    let newOrderDirection = '';
    let newOrderProperty = property;

    if (orderDirection === '') {
      newOrderDirection = 'desc';
    }
    if (orderDirection === 'asc') {
      newOrderDirection = '';
      newOrderProperty = '';
    }
    if (orderDirection === 'desc') {
      newOrderDirection = 'asc';
    }

    dispatch(applySort(newOrderProperty, newOrderDirection));
  };

  const handleNullValue = () => <span className={classes.nullValue}>null</span>;

  const handleArrayValues = (value, column) => {
    const returnValue = [];
    if (column.mode === COLUMN_MODES.REPEATED) {
      returnValue.push(<span key="start">[</span>);
    }
    returnValue.push(
      ...value.flatMap((v, i) => [
        _.isNull(v) ? handleNullValue(v) : v,
        i < value.length - 1 ? (
          <span key={`sep-${i}`}>
            _.isNull(v) ? handleNullValue(v) : ,<br />
          </span>
        ) : undefined,
      ]),
    );
    if (column.mode === COLUMN_MODES.REPEATED) {
      returnValue.push(<span key="end">]</span>);
    }
    return returnValue;
  };

  const handleValues = (value, column) => {
    if (_.isArray(value)) {
      return handleArrayValues(value, column);
    }
    if (_.isNull(value)) {
      return handleNullValue();
    }
    return value;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        {rows && columns && !error && (
          <Table stickyHeader aria-label="sticky table">
            <JadeTableHead
              allowSort={allowSort}
              columns={columns}
              createSortHandler={createSortHandler}
            />
            {!polling && (
              <TableBody data-cy="tableBody">
                {rows.map((row, i) => {
                  const drId = row.datarepo_id;

                  return (
                    <TableRow hover tabIndex={-1} key={drId}>
                      {columns.map((column) => {
                        const value = handleValues(row[column.id], column);
                        return (
                          !_.isUndefined(value) && (
                            <TableCell
                              key={`${column.id}-${drId}`}
                              className={classes.cell}
                              data-cy={`cellvalue-${column.id}-${i}`}
                            >
                              {value}
                            </TableCell>
                          )
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            )}
          </Table>
        )}
        {polling && (
          <LoadingSpinner
            delay={delay}
            delayMessage="For large datasets, it can take a few minutes to fetch results. Thank you for your patience."
          />
        )}
        {error && <Failure errString={errMsg} />}
      </div>
      <TablePagination
        rowsPerPageOptions={TABLE_DEFAULT_ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

JadeTable.propTypes = {
  allowSort: PropTypes.bool,
  classes: PropTypes.object,
  columns: PropTypes.array,
  delay: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  errMsg: PropTypes.string,
  error: PropTypes.bool,
  orderDirection: PropTypes.string,
  page: PropTypes.number.isRequired,
  polling: PropTypes.bool,
  queryParams: PropTypes.object,
  rows: PropTypes.array,
  rowsPerPage: PropTypes.number.isRequired,
  updateDataOnChange: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    columns: state.query.columns,
    delay: state.query.delay,
    error: state.query.error,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    orderDirection: state.query.orderDirection,
    page: state.query.page,
    polling: state.query.polling,
    queryParams: state.query.queryParams,
    rows: state.query.rows,
    rowsPerPage: state.query.rowsPerPage,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTable));
