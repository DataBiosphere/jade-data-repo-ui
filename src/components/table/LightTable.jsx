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

import LightTableHead from './LightTableHead';

const styles = (theme) => ({
  root: {
    border: `1px solid ${theme.palette.primary.dark}`,
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    boxShadow: 'none',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    width: '100%',
    overflowWrap: 'break-word',
  },
  table: {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    minWidth: 700,
  },
  row: {
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  },
  search: {
    height: 45,
    width: 561,
    border: '1px solid #AEB3BA',
    backgroundColor: '#F1F4F8',
    '&:hover': {
      backgroundColor: fade('#99CCFF', 0.2),
    },
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(2),
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
    paddingLeft: theme.spacing(3),
  },
  searchInput: {
    paddingTop: theme.spacing(1.5),
    paddingLeft: theme.spacing(6),
  },
});

const DEFAULT_PAGE_SIZE = 10;

export class LightTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      orderDirection: 'desc',
      orderBy: 'created_date',
      page: 0,
      rowsPerPage: DEFAULT_PAGE_SIZE,
      searchString: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    handleEnumeration: PropTypes.func,
    itemType: PropTypes.string.isRequired,
    rowKey: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.object),
    summary: PropTypes.bool,
    totalCount: PropTypes.number,
    filteredCount: PropTypes.number,
  };

  handleRequestSort = (event, sort) => {
    const { handleEnumeration } = this.props;
    const { orderDirection, orderBy, page, rowsPerPage, searchString } = this.state;
    let newOrder = 'desc';
    if (orderBy === sort && orderDirection === 'desc') {
      newOrder = 'asc';
    }
    const offset = page * rowsPerPage;
    this.setState({ orderDirection: newOrder, orderBy: sort });
    handleEnumeration(rowsPerPage, offset, sort, newOrder, searchString);
  };

  handleChangeRowsPerPage = (event) => {
    const { handleEnumeration } = this.props;
    const { orderDirection, orderBy, page, searchString } = this.state;
    const limit = event.target.value;
    const offset = page * limit;
    this.setState({ rowsPerPage: limit });
    handleEnumeration(limit, offset, orderBy, orderDirection, searchString);
  };

  handleChangePage = (event, page) => {
    const { handleEnumeration } = this.props;
    const { orderDirection, orderBy, rowsPerPage, searchString } = this.state;
    const offset = page * rowsPerPage;
    this.setState({ page }); // offset
    handleEnumeration(rowsPerPage, offset, orderBy, orderDirection, searchString);
  };

  handleSearchString = (event) => {
    const { handleEnumeration } = this.props;
    const { page, orderDirection, orderBy, rowsPerPage } = this.state; // limit
    const offset = page * rowsPerPage;
    const searchString = event.target.value;
    this.setState({ searchString }); // filter
    handleEnumeration(rowsPerPage, offset, orderBy, orderDirection, searchString);
  };

  render() {
    const {
      classes,
      columns,
      itemType,
      rows,
      summary,
      totalCount,
      filteredCount,
      rowKey,
    } = this.props;
    const { orderBy, orderDirection, page, rowsPerPage } = this.state;
    const ROW_HEIGHT = 50;
    const ROWS_PER_PAGE = [5, 10, 25];
    const emptyRows =
      rowsPerPage < filteredCount
        ? rowsPerPage - Math.min(rowsPerPage, filteredCount - page * rowsPerPage)
        : 0;
    return (
      <div>
        {!summary && (
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
            <LightTableHead
              columns={columns}
              onRequestSort={this.handleRequestSort}
              orderDirection={orderDirection}
              orderBy={orderBy}
              summary={summary}
            />
            <TableBody>
              {rows && rows.length > 0 ? (
                rows.map((row) => (
                  <TableRow key={rowKey ? rowKey(row) : row.id} className={classes.row}>
                    {columns.map((col) => (
                      <TableCell key={col.property} style={{ wordBreak: 'break-word' }}>
                        {col.render ? col.render(row) : row[col.property]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className={classes.row}>
                  <TableCell colSpan={columns.length}>
                    No {itemType} have been created yet
                  </TableCell>
                </TableRow>
              )}
              {rows && emptyRows > 0 && rows.length < rowsPerPage && (
                <TableRow style={{ height: ROW_HEIGHT * emptyRows }}>
                  <TableCell colSpan={columns.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          {!summary && rows && filteredCount > rowsPerPage && (
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE}
              component="div"
              count={filteredCount}
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
              labelDisplayedRows={({ from, to, count }) => {
                if (count === totalCount) {
                  return `${from}-${to} of ${count}`;
                }
                return `${from}-${to} of ${count} filtered, ${totalCount} total`;
              }}
            />
          )}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(LightTable);
