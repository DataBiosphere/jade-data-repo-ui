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

const styles = theme => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    // maxHeight: 440,
    overflow: 'auto',
  },
});

export class MichaelTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 100,
    };
  }

  static propTypes = {
    classes: PropTypes.object,
    columns: PropTypes.array,
    queryResults: PropTypes.object,
    rows: PropTypes.array,
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0,
    });
  };

  createData = (columns, row) => {
    let i = 0;
    let res = {};
    for (i = 0; i < columns.length; i++) {
      const column = _.get(columns[i], 'id');
      const value = row[i];
      res[column] = value;
    }

    return res;
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
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
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
