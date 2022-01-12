import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Sort from '@material-ui/icons';

const styles = (theme) => ({
  head: {
    color: theme.palette.primary.dark,
    backgroundColor: 'rgba(233,236,239,0.4)',
    fontFamily: theme.typography.fontFamily,
  },
  cell: {
    color: theme.palette.secondary.dark,
    minWidth: 200,
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: '16px',
    border: `1px solid #e8eaeb`,
  },
});

export class LightTableHead extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.object),
    onRequestSort: PropTypes.func.isRequired,
    orderBy: PropTypes.string.isRequired,
    orderDirection: PropTypes.string.isRequired,
    summary: PropTypes.bool,
  };

  createSortHandler = (property) => (event) => {
    const { onRequestSort } = this.props;
    onRequestSort(event, property);
  };

  render() {
    const { classes, columns, orderDirection, orderBy, summary } = this.props;

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
                {summary ? (
                  col.label
                ) : (
                  <div>
                    {col.label}
                    <Tooltip
                      title="Sort"
                      placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === col.property}
                        direction={orderDirection}
                        onClick={this.createSortHandler(col.property)}
                        IconComponent={Sort}
                        style={{ float: 'right' }}
                      />
                    </Tooltip>
                  </div>
                )}
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
