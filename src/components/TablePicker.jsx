import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';

const styles = theme => ({
  root: {
    marginTop: '1em',
    marginLeft: '1em',
  },
  title: {
    color: theme.palette.primary.main,
    fontSize: '24px',
  },
  input: {
    marginLeft: '1em',
  },
  activeRow: {
    color: theme.palette.primary.main,
  },
});

export class TablePicker extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    currentTable: PropTypes.string,
    pickTable: PropTypes.func.isRequired,
    tables: PropTypes.array.isRequired,
  };

  render() {
    const { classes, tables, pickTable, currentTable } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <Input
            placeholder="filter"
            className={classes.input}
            inputProps={{
              'aria-label': 'description',
            }}
          />
        </div>
        <FixedSizeList height={400} width={300} itemSize={46} itemCount={tables.length}>
          {props => {
            const tableName = tables[props.index].name;
            return (
              <ListItem
                button
                className={tableName === currentTable ? classes.activeRow : classes.row}
                style={props.style}
                key={props.index}
                onClick={() => pickTable(tableName)}
              >
                <ListItemText primary={tableName} />
              </ListItem>
            );
          }}
        </FixedSizeList>
      </div>
    );
  }
}

export default withStyles(styles)(TablePicker);
