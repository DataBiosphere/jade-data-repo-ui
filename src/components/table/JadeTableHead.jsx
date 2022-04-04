import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { connect } from 'react-redux';

import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
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

function JadeTableHead({ columns, createSortHandler, orderProperty, orderDirection }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell
            key={column.name}
            align="left"
            padding="normal"
            sortDirection={orderProperty === column.name ? orderDirection : false}
            data-cy={`columnheader-${column.name}`}
          >
            {column.allowSort && (
              <TableSortLabel
                active={orderProperty === column.name}
                direction={orderDirection}
                onClick={() => createSortHandler(column.name)}
              >
                {column.name}
              </TableSortLabel>
            )}
            {!column.allowSort && <span>{column.name}</span>}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

JadeTableHead.propTypes = {
  columns: PropTypes.array,
  createSortHandler: PropTypes.func,
  orderDirection: PropTypes.string.isRequired,
  orderProperty: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    orderDirection: state.query.orderDirection,
    orderProperty: state.query.orderProperty,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(JadeTableHead));
