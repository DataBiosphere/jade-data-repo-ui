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
import CircularProgress from '@material-ui/core/CircularProgress';
import { changeRowsPerPage, applySort } from 'actions/index';
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
  spinWrapper: {
    height: 'calc(100% - 60px)',
    display: 'grid',
    width: 500,
    textAlign: 'center',
    margin: 'auto',
  },
  spinner: {
    margin: 'auto',
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
  page,
  polling,
  queryParams,
  rows,
  rowsPerPage,
  updateDataOnChange,
}) {
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const c = parseInt(queryParams.totalRows, 10);
    if (c >= 0) {
      setCount(c);
    }
  }, [queryParams]);

  const handleChangePage = (event, newPage) => {
    updateDataOnChange(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(changeRowsPerPage(newRowsPerPage));
    updateDataOnChange(page, newRowsPerPage);
  };

  const createSortHandler = (property) => {
    let newOrder = '';
    let newOrderBy = property;

    if (order === '') {
      newOrder = 'desc';
    }
    if (order === 'asc') {
      newOrder = '';
      newOrderBy = '';
    }
    if (order === 'desc') {
      newOrder = 'asc';
    }

    dispatch(applySort(newOrderBy, order));

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  const handleArrayValues = (value, column) => {
    if (_.isArray(value)) {
      return this.handleArrayValues(value, column);
    }
    if (_.isNull(value)) {
      return this.handleNullValue(classes);
    }
    return value;
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        {rows && columns && (
          <Table stickyHeader aria-label="sticky table">
            <JadeTableHead
              allowSort={allowSort}
              columns={columns}
              orderBy={orderBy}
              order={order}
              createSortHandler={createSortHandler}
            />
            {!polling && (
              <TableBody data-cy="tableBody">
                {rows.map((row, i) => {
                  const drId = row.datarepo_id;

                  return (
                    <TableRow hover tabIndex={-1} key={drId}>
                      {columns.map((column) => {
                        const value = handleArrayValues(row[column.id], column);
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
          <div className={classes.spinWrapper}>
            <CircularProgress className={classes.spinner} />
            {delay &&
              'For large datasets, it can take a few minutes to fetch results from BigQuery. Thank you for your patience.'}
          </div>
        )}
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
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    page: state.query.page,
    polling: state.query.polling,
    queryParams: state.query.queryParams,
    rows: state.query.rows,
    rowsPerPage: state.query.rowsPerPage,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTable));
