import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = () => ({
  root: {
    width: '100%',
  },
});

export class MichaelTableHead extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    columns: PropTypes.array,
    orderBy: PropTypes.string,
    order: PropTypes.string,
    createSortHandler: PropTypes.func,
  };

  render() {
    const { classes, columns, order, orderBy, createSortHandler } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell
              key={column.id}
              align={column.numeric ? 'right' : 'left'}
              padding={column.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === column.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === column.id}
                direction={order}
                onClick={() => createSortHandler(column.id)}
              >
                {column.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

export default withStyles(styles)(MichaelTableHead);
