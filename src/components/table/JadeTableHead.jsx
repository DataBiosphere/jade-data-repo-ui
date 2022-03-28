import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { ColumnModes } from '../../constants';

const styles = (theme) => ({
  root: {
    width: '100%',
  },
  header: {
    backgroundColor: '#fafafa',
    borderBottomColor: theme.palette.lightTable.bottomColor,
  },
});

export class JadeTableHead extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    columns: PropTypes.array,
    createSortHandler: PropTypes.func,
    order: PropTypes.string,
    orderBy: PropTypes.string,
  };

  render() {
    const { classes, columns, order, orderBy, createSortHandler } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columns.map(
            (column) =>
              column.id !== 'datarepo_row_id' && (
                <TableCell
                  className={classes.header}
                  key={column.id}
                  align={column.numeric ? 'right' : 'left'}
                  padding={column.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === column.id ? order : false}
                  data-cy={`columnheader-${column.id}`}
                >
                  {column.mode !== ColumnModes.REPEATED && (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order !== '' ? order : 'desc'}
                      onClick={() => createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  )}
                  {column.mode === ColumnModes.REPEATED && <span>{column.label}</span>}
                </TableCell>
              ),
          )}
        </TableRow>
      </TableHead>
    );
  }
}

export default withStyles(styles)(JadeTableHead);
