import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
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

  render() {
    const { classes, columns, rows } = this.props;
    const { order, orderBy } = this.state;
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
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(JadeTable);
