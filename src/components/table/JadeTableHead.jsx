import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = theme => ({
  head: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    fontFamily: theme.typography.fontFamily,
  },
  cell: {
    minWidth: 200,
  },
});

export class JadeTableHead extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    onRequestSort: PropTypes.func.isRequired,
    orderDirection: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
  };

  createSortHandler = property => event => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { classes, columns, orderDirection, orderBy } = this.props;

    return (
      <TableHead className={classes.head}>
        <TableRow>
          {columns.map(
            col => (
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

export default withStyles(styles)(JadeTableHead);
