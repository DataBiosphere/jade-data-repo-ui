import React from 'react';
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
import { JadeTableHead } from './JadeTableHead';
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
    ...ellipsis,
  },
  nullValue: {
    fontStyle: 'italic',
    textColor: theme.palette.primary.dark,
    color: theme.palette.primary.dark,
  },
});

export class JadeTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 100,
      pageToTokenMap: {},
      orderBy: '',
      order: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    columns: PropTypes.array,
    dataset: PropTypes.object,
    delay: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    polling: PropTypes.bool,
    queryResults: PropTypes.object,
    rows: PropTypes.array,
  };

  handleChangePage = (event, newPage) => {
    const { dispatch, queryResults, dataset } = this.props;
    const { page, rowsPerPage, pageToTokenMap } = this.state;
    const bqStorage = dataset.storage.find(
      (s) => s.cloudResource === GOOGLE_CLOUD_RESOURCE.BIGQUERY,
    );
    const location = bqStorage?.region;
    if (page === 0) {
      pageToTokenMap[0] = undefined;
    }

    if (newPage > page) {
      pageToTokenMap[newPage] = queryResults.pageToken;
    }

    dispatch(
      pageQuery(
        pageToTokenMap[newPage],
        queryResults.jobReference.projectId,
        queryResults.jobReference.jobId,
        rowsPerPage,
        location,
      ),
    );
    this.setState({
      page: newPage,
      pageToTokenMap,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  createSortHandler = (property) => {
    const { dispatch } = this.props;
    const { order } = this.state;
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

    this.setState({
      order: newOrder,
      orderBy: newOrderBy,
    });
  };

  handleArrayValues = (value, column) => {
    const returnValue = [];
    if (column.mode === COLUMN_MODES.REPEATED) {
      returnValue.push(<span key="start">[</span>);
    }
    returnValue.push(
      ...value.flatMap((v, i) => [
        v,
        i < value.length - 1 ? (
          <span key={`sep-${i}`}>
            ,<br />
          </span>
        ) : undefined,
      ]),
    );
    if (column.mode === COLUMN_MODES.REPEATED) {
      returnValue.push(<span key="end">]</span>);
    }
    return returnValue;
  };

  handleNullValue = (classes) => <span className={classes.nullValue}>null</span>;

  handleValues = (value, column, classes) => {
    if (_.isArray(value)) {
      return this.handleArrayValues(value, column);
    }
    if (_.isNull(value)) {
      return this.handleNullValue(classes);
    }
    return value;
  };

  render() {
    const { classes, queryResults, columns, rows, polling, delay } = this.props;
    const { page, rowsPerPage, orderBy, order } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          {rows && columns && (
            <Table stickyHeader aria-label="sticky table">
              <JadeTableHead
                columns={columns}
                orderBy={orderBy}
                order={order}
                createSortHandler={this.createSortHandler}
              />
              {!polling && (
                <TableBody data-cy="tableBody">
                  {rows.map((row, i) => {
                    const drId = row.datarepo_id;

                    return (
                      <TableRow hover tabIndex={-1} key={drId}>
                        {columns.map((column) => {
                          const value = this.handleValues(row[column.id], column, classes);
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
          count={parseInt(queryResults.totalRows, 10) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  return {
    dataset: state.datasets.dataset,
    delay: state.query.delay,
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    token: state.user.token,
    queryResults: state.query.queryResults,
    columns: state.query.columns,
    rows: state.query.rows,
    polling: state.query.polling,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTable));
