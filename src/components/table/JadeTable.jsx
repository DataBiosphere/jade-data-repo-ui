import React, { useState } from 'react';
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
import { pageQuery, applySort } from 'actions/index';
import JadeTableHead from './JadeTableHead';
import { ellipsis } from '../../libs/styles';
import { COLUMN_MODES, GOOGLE_CLOUD_RESOURCE } from '../../constants';

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
  dataset,
  delay,
  dispatch,
  polling,
  queryParams,
  rows,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [pageToTokenMap, setPageToTokenMap] = useState({});
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('');

  const handleChangePage = (event, newPage) => {
    const bqStorage = dataset.storage.find(
      (s) => s.cloudResource === GOOGLE_CLOUD_RESOURCE.BIGQUERY,
    );
    const location = bqStorage?.region;
    if (page === 0) {
      pageToTokenMap[0] = undefined;
    }

    if (newPage > page) {
      pageToTokenMap[newPage] = queryParams.pageToken;
    }

    dispatch(
      pageQuery(
        pageToTokenMap[newPage],
        queryParams.projectId,
        queryParams.jobId,
        rowsPerPage,
        location,
      ),
    );
    setPage(newPage);
    setPageToTokenMap(pageToTokenMap);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        rowsPerPageOptions={[100]}
        component="div"
        count={parseInt(queryParams.totalRows, 10) || 0}
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
  dataset: PropTypes.object,
  delay: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  polling: PropTypes.bool,
  queryParams: PropTypes.object,
  rows: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    delay: state.query.delay,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    token: state.user.token,
    queryParams: state.query.queryParams,
    columns: state.query.columns,
    rows: state.query.rows,
    polling: state.query.polling,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTable));
