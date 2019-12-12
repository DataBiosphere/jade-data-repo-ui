import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { pageQuery } from 'actions/index';

const styles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: '40em',
    overflow: 'auto',
  },
});

export class MichaelTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 100,
      pageToTokenMap: {},
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    columns: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    queryResults: PropTypes.object,
    rows: PropTypes.array,
  };

  handleChangePage = (event, newPage) => {
    const { dispatch, queryResults } = this.props;
    const { page, rowsPerPage, pageToTokenMap } = this.state;

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
      ),
    );
    this.setState({
      page: newPage,
      pageToTokenMap,
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0,
    });
  };

  render() {
    const { classes, queryResults, columns, rows } = this.props;
    const { page, rowsPerPage } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          {rows && columns && (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.map(column => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {!rows && !columns && (
            <div className={classes.root}>
              <CircularProgress />
            </div>
          )}
        </div>
        <TablePagination
          rowsPerPageOptions={[100]}
          component="div"
          count={queryResults.totalRows}
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
    filterData: state.query.filterData,
    filterStatement: state.query.filterStatement,
    token: state.user.token,
    queryResults: state.query.queryResults,
    columns: state.query.columns,
    rows: state.query.rows,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(MichaelTable));
