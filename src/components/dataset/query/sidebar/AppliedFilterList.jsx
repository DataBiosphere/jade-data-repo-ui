import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { applyFilters } from '../../../../actions';
import { Chip, Typography, Collapse, Badge, Avatar } from '@material-ui/core';
import { ExpandLess, ExpandMore, TableChart, ArrowRight, ArrowDropDown } from '@material-ui/icons';

const styles = theme => ({
  filterHeader: {
    paddingTop: '8px',
    paddingBottom: '4px',
    lineHeight: 'inherit',
  },
  rangeInfo: {
    display: 'inline',
  },
  inline: {
    margin: '2px',
  },
  tableName: {
    justifyContent: 'space-between',
    fontWeight: 500,
  },
  box: {
    margin: '8px 16px 8px 16px',
  },
});

const StyledBadge = withStyles(theme => ({
  badge: {
    right: 12,
    top: 0,
    backgroundColor: theme.palette.primary.lightContrast,
  },
}))(Badge);

export class AppliedFilterList extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object,
    filterData: PropTypes.object,
    dataset: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    selected: PropTypes.string,
    table: PropTypes.string,
    handleExpand: PropTypes.func,
    open: PropTypes.bool,
  };

  clearFilter = (table, filter, datum) => {
    const { dispatch, filterData, dataset, selected } = this.props;
    const { relationships } = dataset.schema;
    const clonedData = _.cloneDeep(filterData);
    const clonedFilter = clonedData[table][filter];
    const filterValue = clonedFilter.value;

    if (clonedFilter.type !== 'range') {
      if (Array.isArray(filterValue)) {
        filterValue.splice(filterValue.indexOf(datum), 1);
      }
      if (_.isPlainObject(filterValue)) {
        delete filterValue[datum];
      }
    }

    if (_.isEmpty(filterValue) || clonedFilter.type === 'range') {
      delete clonedData[table][filter];
    }

    if (_.isEmpty(clonedData[table])) {
      delete clonedData[table];
    }

    dispatch(applyFilters(clonedData, relationships, selected, dataset));
  };


  render() {
    const { classes, filterData, table, handleExpand, open } = this.props;
    let numFilters = 0;
    const listFilters = _.keys(filterData[table]).map(filter => {
      const data = _.get(filterData[table], filter);
      let dataString = data.value;

      if (data.type === 'range') {
        dataString = (
          <Chip
            onDelete={() => this.clearFilter(table, filter)}
            className={classes.inline}
            label={_.join(data.value, ' \u2013 ')}
          />
        );
        numFilters++;
      } 
      
      else {
        if (_.isPlainObject(data.value)) {
          dataString = _.keys(data.value);
        }
        dataString = dataString.map((datum, i) => (
          <Chip
            key={i}
            onDelete={() => this.clearFilter(table, filter, datum)}
            className={classes.inline}
            label={datum}
          />
        ));
        numFilters += dataString.length;
      }

      return (
        <List
          key={filter}
          subheader={
            <ListSubheader className={classes.filterHeader} component="div">
              {filter}
            </ListSubheader>
          }
        >
          <ListItem dense={true}>{dataString}</ListItem>
        </List>
      );
    });

    return (
      <div>
        <ListItem className={classes.tableName} button onClick={() => handleExpand(!open)}>
          {table}
          {open ? <ExpandLess /> : <StyledBadge badgeContent={numFilters}/>}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Card variant='outlined' className={classes.box}>
            {listFilters}
          </Card>
        </Collapse>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    filterData: state.query.filterData,
    dataset: state.datasets.dataset,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(AppliedFilterList));
