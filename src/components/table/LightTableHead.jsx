import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = (theme) => ({
  head: {
    color: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.light,
    fontFamily: theme.typography.fontFamily,
  },
  cell: {
    color: theme.palette.secondary.dark,
    minWidth: 200,
    fontWeight: 500,
  },
});

export class LightTableHead extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    onRequestSort: PropTypes.func.isRequired,
    orderBy: PropTypes.string.isRequired,
    orderDirection: PropTypes.string.isRequired,
  };

  createSortHandler = (property) => (event) => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { classes, columns, orderDirection, orderBy } = this.props;

    return (
      <TableHead className={classes.head}>
        <TableRow>
          {columns.map(
            (col) => (
              <TableCell
                className={classes.cell}
                key={col.property}
                align={col.numeric ? 'right' : 'left'}
                padding={col.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === col.id ? orderDirection : false}
              >
                <Tooltip
                  title="Sort"
                  placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === col.property}
                    direction={orderDirection}
                    onClick={this.createSortHandler(col.property)}
                  >
                    {col.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

export default withStyles(styles)(LightTableHead);
