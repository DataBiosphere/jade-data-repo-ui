import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';

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
  search: {
    height: 45,
    width: 561,
    border: '1px solid #AEB3BA',
    backgroundColor: '#F1F4F8',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
  },
  searchIcon: {
    color: theme.palette.primary.main,
    width: 22,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing.unit * 3,
  },
  searchInput: {
    paddingTop: theme.spacing.unit * 1.5,
    paddingLeft: theme.spacing.unit * 6,
  },
});

export class JadeTable extends React.PureComponent {
  state = {
    orderDirection: 'asc',
    orderBy: 'created_date',
    page: 0,
    rowsPerPage: 5,
    searchString: '',
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    handleFilter: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object),
    summary: PropTypes.bool,
  };

  handleRequestSort = (event, sort) => {
    const { handleFilter } = this.props;
    const { orderDirection, orderBy, page, rowsPerPage, searchString } = this.state;
    let newOrder = 'desc';
    if (orderBy === sort && orderDirection === 'desc') {
      newOrder = 'asc';
    }
    const offset = page * rowsPerPage;
    this.setState({ order: newOrder, orderBy: sort });
    handleFilter(rowsPerPage, offset, sort, newOrder, searchString);
  };

  handleChangeRowsPerPage = event => {
    const { handleFilter } = this.props;
    const { orderDirection, orderBy, page, searchString } = this.state;
    const limit = event.target.value;
    const offset = page * limit;
    this.setState({ rowsPerPage: limit });
    handleFilter(limit, offset, orderBy, orderDirection, searchString);
  };

  handleChangePage = (event, page) => {
    const { handleFilter } = this.props;
    const { orderDirection, orderBy, rowsPerPage, searchString } = this.state;
    const offset = page * rowsPerPage;
    this.setState({ page }); // offset
    handleFilter(rowsPerPage, offset, orderBy, orderDirection, searchString);
  };

  handleSearchString = event => {
    const { handleFilter } = this.props;
    const { page, orderDirection, orderBy, rowsPerPage } = this.state; // limit
    const offset = page * rowsPerPage;
    const searchString = event.target.value;
    this.setState({ searchString }); // filter
    handleFilter(rowsPerPage, offset, orderBy, orderDirection, searchString);
  };

  render() {
    const { classes, columns, summary, rows } = this.props;
    const { order, orderBy, page, rowsPerPage } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, 8 - page * rowsPerPage);
    const fullView = true || !summary;
    return (
      <div>
        {fullView && (
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search"
              classes={{
                root: classes.inputRoot,
                input: classes.searchInput,
              }}
              onChange={this.handleSearchString}
            />
          </div>
        )}
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <JadeTableHead
              columns={columns}
              onRequestSort={this.handleRequestSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {rows.map(row => (
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
          {fullView && (
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
      </div>
    );
  }
}

export default withStyles(styles)(JadeTable);
