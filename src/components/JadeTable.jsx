import React from 'react';
import PropTypes from 'prop-types';
//import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class DataTable extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.objectOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          property: PropTypes.string.isRequired,
        }),
      ),
    ),
    rows: PropTypes.arrayOf(PropTypes.object),
  };

  render() {
    const { classes, columns, rows } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell>{col.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                {columns.map(col => (
                  <TableCell>{row[col.property]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withStyles(styles)(DataTable);
