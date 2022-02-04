import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { COLUMN_MODES } from '../../constants';

const styles = () => ({
  root: {
    width: '100%',
  },
});

export class JadeTableHead extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.array,
    createSortHandler: PropTypes.func,
    order: PropTypes.string,
    orderBy: PropTypes.string,
  };

  render() {
    const { columns, order, orderBy, createSortHandler } = this.props;

    return (
      <TableHead>
        <TableRow>
          {columns.map(
            (column) =>
              column.id !== 'datarepo_row_id' && (
                <TableCell
                  key={column.id}
                  align={column.numeric ? 'right' : 'left'}
                  padding={column.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === column.id ? order : false}
                  data-cy={`columnheader-${column.id}`}
                >
                  {column.mode !== COLUMN_MODES.REPEATED && (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={order !== '' ? order : 'desc'}
                      onClick={() => createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  )}
                  {column.mode === COLUMN_MODES.REPEATED && <span>{column.label}</span>}
                </TableCell>
              ),
          )}
        </TableRow>
      </TableHead>
    );
  }
}

export default withStyles(styles)(JadeTableHead);
