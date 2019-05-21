import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import JadeTableHead from './JadeTableHead';

const styles = theme => ({
  root: {
    borderRadius: '2px 2px 0 0 ',
    marginTop: theme.spacing.unit * 3,
    maxWidth: 1400,
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    borderRadius: '2px 2px 0 0 ',
    minWidth: 700,
  },
  row: {
    borderRadius: '2px 2px 0 0 ',
  },
});

const desc = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const getSorting = (order, orderBy) =>
  order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);

export class JadeTable extends React.PureComponent {
  state = {
    order: 'asc',
    orderBy: 'lastModified',
    page: 0,
    rowsPerPage: 5,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    handleChangePage: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object),
  };

  handleRequestSort = (event, property) => {
    const { order, orderBy } = this.state;
    let newOrder = 'desc';
    if (orderBy === property && order === 'desc') {
      newOrder = 'asc';
    }

    this.setState({ order: newOrder, orderBy: property });
  };

  handleChangeRowsPerPage = event => {
    const { handleChangePage } = this.props;
    const limit = event.target.value;
    this.setState({ rowsPerPage: limit });
    handleChangePage(limit);
  };

  handleChangePage = (event, page) => {
    const { handleChangePage } = this.props;
    const { rowsPerPage } = this.state; // limit
    this.setState({ page }); // offset
    const offset = page * rowsPerPage;
    handleChangePage(rowsPerPage, offset);
  };

  render() {
    const { classes, columns, handleChangePage, rows } = this.props;
    const { order, orderBy, page, rowsPerPage } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, 8 - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <JadeTableHead
            columns={columns}
            onRequestSort={this.handleRequestSort}
            order={order}
            orderBy={orderBy}
          />
          <TableBody>
            {stableSort(rows, getSorting(order, orderBy)).map(row => (
              <TableRow key={row.id} className={classes.row}>
                {columns.map(col => (
                  <TableCell key={col.property}>
                    {col.render ? col.render(row) : row[col.property]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length < rowsPerPage && (
              <TableRow style={{ height: 50 * emptyRows }}>
                <TableCell colSpan={columns.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        {handleChangePage && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={8} //rows.length
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(JadeTable);
